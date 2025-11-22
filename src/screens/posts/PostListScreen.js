import React, { useEffect, useState, useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { signOut, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, collection, onSnapshot, orderBy, query, where, getDocs } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../../../firebaseConfig';
import { logout, deleteAccount } from '../../services/authService';
import Setting from '../../components/Setting';
import styles from "../../styles/PostListStyle";

const PostListScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [settingsVisible, setSettingVisible] = useState(false);

  // 헤더에 톱니바퀴 버튼 추가
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '게시글 목록',
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={() => setSettingVisible(true)} style={{ paddingHorizontal: 12 }}>
          <Text style={{ fontSize: 18 }}>⚙️</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(list);
    });

    return () => unsubscribe();
  }, []);

  const formatTime = createdAt => {
    if (!createdAt || !createdAt.toDate) return '';
    const d = createdAt.toDate();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  // 로그아웃
  // const handleLogout = async () => {
  //   try{
  //     await logout();
  //     Alert.alert("로그아웃", "성공적으로 로그아웃되었습니다.");
  //     navigation.replace('Login');    // 로그인 화면으로 되돌리기
  //   } catch(error){
  //     console.log(error);
  //     Alert.alert("로그아웃 실패", error.message);
  //   }
  // };

  // // 탈퇴(계정 삭제 + Firestore users 문서 삭제)
  // const handleDeleteAccount = async () => {
  //   Alert.alert(
  //     '회원 탈퇴',
  //     '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
  //     [
  //       { text: '취소', style: 'cancel' },
  //       {
  //         text: '탈퇴',
  //         style: 'destructive',
  //         onPress: async () => {
  //           try {
  //             await deleteAccount(user.uid);  // service 호출 (글+댓글+이미지+유저 삭제)
  //             Alert.alert("탈퇴 완료", "계정이 삭제되었습니다.");
  //             navigation.replace("Login");
  //           } catch (error) {
  //             console.log(error);
  //             if (error.code === "auth/requires-recent-login") {
  //               Alert.alert("탈퇴 실패", "보안을 위해 다시 로그인 후 탈퇴를 진행해주세요.");
  //             } 
  //             else {
  //               Alert.alert("탈퇴 실패", error.message);
  //             }
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  const renderItem = ({ item }) => {
    const commentCount = item.commentCount ?? 0;
    const authorName = item.authorName;
    const timeText = formatTime(item.createdAt);

    return (
      <TouchableOpacity style={styles.postRow} onPress={() => navigation.navigate('PostDetail', { postId: item.id })}>
        {/* 왼쪽: 제목 + 메타 + 한 줄 내용 */}
        <View style={styles.postMain}>
          <Text style={styles.postTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{authorName}</Text>
            {timeText ? <Text style={styles.metaText}>  {timeText}</Text> : null}
            <Text style={styles.metaText}>  · 댓글 {commentCount}개</Text>
          </View>
          <Text style={styles.postPreview} numberOfLines={1}>
            {item.content}
          </Text>
        </View>

        {/* 오른쪽: 썸네일 + 댓글 박스 느낌 */}
        <View style={styles.rightArea}>
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
          )}
          <View style={styles.commentBadge}>
            <Text style={styles.commentCount}>{commentCount}</Text>
            <Text style={styles.commentLabel}>댓글</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* <Text style={styles.screenTitle}>게시글 목록</Text> */}

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        {/* 글 작성 버튼 */}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PostWrite')}>
          <Text style={styles.fabText}>🖊️</Text>
        </TouchableOpacity>

        {/* 설정 모달 (로그아웃/탈퇴) */}
        <Setting
          visible={settingsVisible}
          onClose={() => setSettingVisible(false)}
        />
      </View>
    </SafeAreaView>
  )
}

export default PostListScreen;