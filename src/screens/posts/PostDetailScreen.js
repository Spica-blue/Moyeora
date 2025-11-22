import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

const PostDetailScreen = ({ route, navigation }) => {
  const { postId } = route.params; // 목록에서 넘겨준 id
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* 제목 */}
        <Text style={styles.title}>{post.title}</Text>

        {/* 작성자 + 날짜 + 댓글 수 */}
        <View style={styles.metaRow}>
          <Text style={styles.metaAuthor}>{post.authorName}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaDate}>{formatDate(post.createdAt)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaDate}>댓글 {post.commentCount ?? 0}개</Text>
        </View>

        <View style={styles.divider} />

        {/* 내용 */}
        <Text style={styles.content}>{post.content}</Text>

        {/* 이미지들 */}
        {imageUrls.length > 0 && (
          <View style={styles.imageList}>
            {imageUrls.map((url, idx) => (
              <Image key={idx} source={{ uri: url }} style={styles.image} />
            ))}
          </View>
        )}

        {/* 작성자일 때만 삭제 버튼 노출 */}
        {isAuthor && (
          <View style={styles.buttonRow}>
            <Button title="게시글 삭제" color="red" onPress={handleDelete} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaAuthor: {
    fontSize: 13,
    color: '#444',
  },
  metaDot: {
    fontSize: 13,
    color: '#aaa',
    marginHorizontal: 4,
  },
  metaDate: {
    fontSize: 12,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  content: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
  },
  imageList: {
    marginTop: 16,
    gap: 12,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  buttonRow: {
    marginTop: 24,
  },
});
