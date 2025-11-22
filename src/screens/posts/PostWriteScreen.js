import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, getDoc, collection, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../../firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from "../../styles/PostWriteStyle";

const PostWriteScreen = ({ navigation, route }) => {
  const mode = route?.params?.mode || 'create';
  const postId = route?.params?.postId || null;
  const isEdit = mode === 'edit' && postId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  const [submitting, setSubmitting] = useState(false);

  // 수정 모드일 때 기존 글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!isEdit) return;

      try {
        const postRef = doc(db, 'posts', postId);
        const snap = await getDoc(postRef);

        if (!snap.exists()) {
          Alert.alert('오류', '게시글 정보를 불러올 수 없습니다.');
          navigation.goBack();
          return;
        }

        const data = snap.data();
        setTitle(data.title || '');
        setContent(data.content || '');
        const urls = data.imageUrls || (data.imageUrl ? [data.imageUrl] : []);
        setExistingImageUrls(urls);
      } catch (err) {
        console.log(err);
        Alert.alert('오류', '게시글 정보를 불러오는 중 문제가 발생했습니다.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [isEdit, postId, navigation]);

  // Stack 헤더를 "✕  글 작성  등록" 형태로 커스터마이징
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '글 작성',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 20 }}>✕</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={onSubmit} style={{ paddingHorizontal: 8 }}>
          <Text style={styles.headerRight}>등록</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, content, images]);

  // 사진 선택
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if(!result.canceled){
      const uris = result.assets.map(a => a.uri);
      setImages(prev => [...prev, ...uris]);
    }
  };

  // Storage 업로드
  const uploadImages = async () => {
    if(!images.length) return [];

    const urls = [];

    for(const uri of images){
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = `postImages/${auth.currentUser.uid}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
      const imageRef = ref(storage, filename);

      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);
      urls.push(downloadUrl);
    }
    
    return urls;
  };

  // 글 작성 처리
  const onSubmit = async () => {
    if(!title || !content){
      Alert.alert("오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try{
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('오류', '로그인 정보가 없습니다.');
        return;
      }

      // Firestore users에서 닉네임 가져오기
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const nickname = userDoc.data().nickname;

      const imageUrls = await uploadImages();   // 사진 있으면 업로드

      if(isEdit){
        // 수정 모드 : updateDoc
        const postRef = doc(db, 'posts', postId);
        
        // 기존 이미지 + 새 이미지 합치기
        const mergedImageUrls = [...existingImageUrls, ...imageUrls];

        await updateDoc(postRef, {
          title,
          content,
          imageUrls: mergedImageUrls,
          imageUrl: mergedImageUrls[0] || null,
        });

        Alert.alert("수정 완료", "게시글이 수정되었습니다.");
        navigation.goBack();
      }
      else{
        // 새 글 작성 모드 : addDoc
        await addDoc(collection(db, "posts"), {
          title,
          content,
          authorId: user.uid,
          authorName: nickname,
          imageUrls,
          imageUrl: imageUrls[0] || null,
          commentCount: 0,
          createdAt: serverTimestamp(),
        });

        Alert.alert("작성 완료", "게시글이 등록되었습니다!");
        navigation.goBack();
      }
    } catch(error){
      console.log(error);
      Alert.alert("에러", error.message);
    } finally{
      setSubmitting(false);
    }
  };

  // 특정 이미지 삭제(길게 눌러서 지우기 같은 용도)
  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if(loading){
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    )
  }

  const allPreviewImages = [...existingImageUrls, ...images];
  
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 본문 영역 */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* 제목 입력 */}
          <TextInput
            style={styles.titleInput}
            placeholder='제목'
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#bbb"
          />
          <View style={styles.divider} />

          {/* 내용 입력 */}
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="내용을 입력하세요."
            textAlignVertical="top"
            placeholderTextColor="#bbb"
          />

          {/* 본문 아래에 첨부된 이미지들 */}
          {allPreviewImages.length > 0 && (
            <View style={styles.imageList}>
              {allPreviewImages.map((uri, idx) => (
                <TouchableOpacity key={idx} onLongPress={() => removeImage(idx)}>
                  <Image source={{ uri }} style={styles.image} />
                </TouchableOpacity>
              ))}
              <Text style={styles.imageHint}>
                ※ 사진을 길게 누르면 삭제할 수 있어요.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* 하단 툴바 (카메라 아이콘 → 사진 첨부) */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarButton} onPress={pickImage}>
            <Text style={styles.toolbarIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {submitting && (
          <View style={styles.overlay}>
            <View style={styles.box}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.text}>업로드 중...</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default PostWriteScreen;