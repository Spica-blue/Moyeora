import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from "../../../firebaseConfig";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUp = async () => {
    if(!email || !password){
      Alert.alert("회원가입", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try{
      // Firebase Auth에 계정 생성
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;

      // Firestore에 users 컬렉션에 유저 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
      });

      Alert.alert("회원가입 완료", "회원가입이 완료되었습니다. 로그인 해주세요.");
      navigation.replace('Login');  // 로그인 화면으로 이동(뒤로가기 눌러도 안 돌아오게)
    } catch(error){
      console.log(error);
      Alert.alert("회원가입 실패", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="회원가입" onPress={onSignUp} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>이미 계정이 있다면? 로그인 하기</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    color: "black",
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#007AFF',
  },
});