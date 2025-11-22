import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, Button, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, deleteDoc, collection, addDoc, onSnapshot, orderBy, query, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import styles from "../../styles/PostDetailStyle";

const PostDetailScreen = ({ route, navigation }) => {
  const { postId } = route.params; // 목록에서 넘겨준 id

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  const currentUser = auth.currentUser;
  const isAuthor = currentUser && post && post.authorId === currentUser.uid;

  useEffect(() => {
    const fetchPost = async () => {
      try{
        const ref = doc(db, 'posts', postId);
        const snap = await getDoc(ref);

        if(!snap.exists()){
          Alert.alert("오류", "게시글을 찾을 수 없습니다.");
          navigation.goBack();
          return;
        }

        setPost({ id: snap.id, ...snap.data() });
        navigation.setOptions({ title: '글 상세' });
      } catch(err){
        console.log(err);
        Alert.alert("오류", "게시글을 불러오는 중 문제가 발생했습니다.");
        navigation.goBack();
      } finally{
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigation]);

  // 댓글 실시간
  useEffect(() => {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setComments(list);
    });

    return () => unsubscribe();
  }, [postId]);

  const formatDate = createdAt => {
    if(!createdAt || !createdAt.toDate) return '';
    const d = createdAt.toDate();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}.${m}.${day} ${h}:${min}`;
  };

  // 게시글 삭제
  const handleDelete = () => {
    if(!post) return;

    Alert.alert('게시글 삭제', '정말로 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try{
            await deleteDoc(doc(db, 'posts', post.id));
            Alert.alert("삭제 완료", "게시글이 삭제되었습니다.");
            navigation.goBack();
          } catch(err){
            console.log(err);
            Alert.alert("삭제 실패", "게시글 삭제 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  // 댓글 작성
  const handleSendComment = async () => {
    const trimmed = commentText.trim();
    if(!trimmed) return;

    if(!currentUser){
      Alert.alert("로그인 필요", "댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    try{
      setSendingComment(true);

      // 닉네임 읽기
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const nickname = userDoc.data().nickname;

      // 댓글 추가(posts/{postId}/comments)
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        authorId: currentUser.uid,
        authorName: nickname,
        content: trimmed,
        createdAt: new Date(),
      });

      // posts 문서의 commentCount 증가(있으면)
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(1),
      }).catch(() => {});

      setCommentText('');
    } catch(err){
      console.log(err);
      Alert.alert("댓글 작성 실패", "댓글을 작성하는 중 오류가 발생했습니다.");
    } finally{
      setSendingComment(false);
    }
  };

  if(loading){
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if(!post){
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text>게시글을 불러올 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const imageUrls = post.imageUrls || (post.imageUrl ? [post.imageUrl] : []);
  const commentCount = comments.length;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {/* 제목 */}
            <Text style={styles.title}>{post.title}</Text>

            {/* 작성자 + 시간 */}
            <View style={styles.metaRow}>
              <Text style={styles.metaAuthor}>{post.authorName}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaDate}>
                {post.createdAt ? formatDate(post.createdAt) : ''}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* 본문 내용 */}
            <Text style={styles.content}>{post.content}</Text>

            {/* 첨부 이미지 */}
            {imageUrls.length > 0 && (
              <View style={styles.imageList}>
                {imageUrls.map((url, idx) => (
                  <Image key={idx} source={{ uri: url }} style={styles.image} />
                ))}
              </View>
            )}

            {/* 수정 / 삭제 버튼 영역 */}
            {isAuthor && (
              <View style={styles.actionBox}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    navigation.navigate('PostWrite', {
                      mode: 'edit',
                      postId: post.id,
                    })
                  }
                >
                  <Text style={styles.actionText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { marginLeft: 12 }]}
                  onPress={handleDelete}
                >
                  <Text style={[styles.actionText, { color: '#D32F2F' }]}>
                    삭제
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 댓글 헤더 */}
            <View style={styles.commentHeader}>
              <Text style={styles.commentHeaderText}>
                댓글 {commentCount}
              </Text>
            </View>

            {/* 댓글 목록 */}
            {comments.map(c => (
              <View key={c.id} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>
                  {c.authorName}
                </Text>
                <Text style={styles.commentDate}>
                  {c.createdAt ? formatDate(c.createdAt) : ''}
                </Text>
                <Text style={styles.commentContent}>{c.content}</Text>
              </View>
            ))}

            {comments.length === 0 && (
              <Text style={styles.noCommentText}>첫 댓글을 남겨보세요.</Text>
            )}
          </ScrollView>

          {/* 댓글 입력 영역 (화면 맨 아래 고정) */}
          <View style={styles.commentInputBar}>
            <TextInput
              style={styles.commentInput}
              placeholder="댓글을 남겨보세요."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={styles.commentSendButton}
              onPress={handleSendComment}
              disabled={sendingComment || !commentText.trim()}
            >
              <Text
                style={[
                  styles.commentSendText,
                  (!commentText.trim() || sendingComment) && { color: '#bbb' },
                ]}
              >
                등록
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetailScreen;
