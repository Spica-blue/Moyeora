import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { signOut, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

const PostListScreen = ({ navigation }) => {
  // 로그아웃
  const handleLogout = async () => {
    try{
      await signOut(auth);
      Alert.alert("로그아웃", "성공적으로 로그아웃되었습니다.");
      navigation.replace('Login');    // 로그인 화면으로 되돌리기
    } catch(error){
      console.log(error);
      Alert.alert("로그아웃 실패", error.message);
    }
  };

  // 탈퇴(계정 삭제 + Firestore users 문서 삭제)
  const hanldeDeleteAccount = async () => {
    Alert.alert(
      '회원 탈퇴',
      '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try{
              const user = auth.currentUser;
              if(!user){
                Alert.alert("오류", "로그인된 사용자가 없습니다.");
                return;
              }

              // 1) Firestore users 컬렉션 문서 삭제
              await deleteDoc(doc(db, 'users', user.uid));

              // 2) Firebase Auth 계정 삭제
              await deleteUser(user);

              Alert.alert("탈퇴 완료", "계정이 삭제되었습니다.");
              navigation.replace('Login');
            } catch(error){
              console.log(error);

              // 최근 로그인 요구 에러 처리
              if(error.code === 'auth/requires-recent-login'){
                Alert.alert("탈퇴 실패", "보안을 위해 다시 로그인 후 탈퇴를 진행해주세요.");
              }
              else{
                Alert.alert("탈퇴 실패", error.message);
              }
            }
          },
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>모여라! 게시글 목록</Text>
      <Text style={styles.subtitle}>글 목록 들어갈 예정</Text>
      
      <View style={styles.buttonGroup}>
        <Button title='로그아웃' onPress={handleLogout} />
      </View>

      <View style={styles.buttonGroup}>
        <Button title='회원 탈퇴' onPress={hanldeDeleteAccount} color="red"/>
      </View>
    </View>
  )
}

export default PostListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
  },
  buttonGroup: {
    marginTop: 12,
  },
});