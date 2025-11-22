import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseConfig';
import { deleteAccount, logout } from '../services/authService';

const Setting = ({ visible, onClose }) => {
  const navigation = useNavigation();

  // 로그아웃
  const handleLogout = async () => {
    try{
      await logout();
      Alert.alert("로그아웃", "성공적으로 로그아웃되었습니다.");
      navigation.replace('Login');    // 로그인 화면으로 되돌리기
    } catch(error){
      console.log(error);
      Alert.alert("로그아웃 실패", error.message);
    }
  };

  // 탈퇴(계정 삭제 + Firestore users 문서 삭제)
  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('오류', '로그인된 사용자가 없습니다.');
      return;
    }

    Alert.alert(
      '회원 탈퇴',
      '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(user.uid);  // service 호출 (글+댓글+이미지+유저 삭제)
              Alert.alert("탈퇴 완료", "계정이 삭제되었습니다.");
              navigation.replace("Login");
            } catch (error) {
              console.log(error);
              if (error.code === "auth/requires-recent-login") {
                Alert.alert("탈퇴 실패", "보안을 위해 다시 로그인 후 탈퇴를 진행해주세요.");
              } 
              else {
                Alert.alert("탈퇴 실패", error.message);
              }
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.item}
            onPress={async () => {
              onClose && onClose();
              await handleLogout();
            }}
          >
            <Text style={styles.itemText}>로그아웃</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose && onClose();
              handleDeleteAccount();
            }}
          >
            <Text style={[styles.itemText, { color: '#D32F2F' }]}>
              회원 탈퇴
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item} onPress={onClose}>
            <Text style={[styles.itemText, { color: '#777' }]}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default Setting;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
});