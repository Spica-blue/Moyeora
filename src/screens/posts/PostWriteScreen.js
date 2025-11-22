import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../../firebaseConfig';
import styles from "../../styles/PostWriteStyle";
import { SafeAreaView } from 'react-native-safe-area-context';

const PostWriteScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

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

    try{
      const user = auth.currentUser;

      // Firestore users에서 닉네임 가져오기
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const nickname = userDoc.data().nickname;

      const imageUrls = await uploadImages();   // 사진 있으면 업로드

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
    } catch(error){
      console.log(error);
      Alert.alert("에러", error.message);
    }
  };

  // 특정 이미지 삭제(길게 눌러서 지우기 같은 용도)
  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>글 작성</Text>
      
        <TextInput
          style={styles.input}
          placeholder='제목'
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder='내용을 입력하세요'
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* {images && <Image source={{ uri: images }} style={styles.image} />} */}

        {/* 본문 아래에 사진들이 들어가니까, 보기에도 “본문에 포함된” 느낌 */}
        {images.length > 0 && (
          <View style={styles.imageList}>
            {images.map((uri, idx) => (
              <TouchableOpacity key={idx} onLongPress={() => removeImage(idx)}>
                <Image source={{ uri }} style={styles.image} />
              </TouchableOpacity>
            ))}
            <Text style={styles.imageHint}>※ 사진을 길게 누르면 삭제할 수 있어요.</Text>
          </View>
        )}

        {/* <Button title='사진 첨부' onPress={pickImage} /> 
        <Button title='작성 완료' onPress={onSubmit} /> */}
        <View style={styles.buttonRow}>
          <Button title="사진 첨부" onPress={pickImage} />
        </View>
        <View style={styles.buttonRow}>
          <Button title="작성 완료" onPress={onSubmit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PostWriteScreen;