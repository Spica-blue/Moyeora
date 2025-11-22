import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from "../../../firebaseConfig";
import styles from "../../styles/SignUpStyle";

const SignUpScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const onSignUp = async () => {
    if(!nickname || !email || !password || !passwordCheck){
      Alert.alert("회원가입", "모든 항목을 입력해주세요.");
      return;
    }

    if(password !== passwordCheck){
      Alert.alert("비밀번호 오류", "비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try{
      // Firebase Auth에 계정 생성
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;

      // Firestore에 users 컬렉션에 유저 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        nickname: nickname,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      Alert.alert("회원가입 완료", "회원가입이 완료되었습니다!");
      navigation.replace('Login');  // 로그인 화면으로 이동(뒤로가기 눌러도 안 돌아오게)
    } catch(error){
      console.log(error);
      Alert.alert("회원가입 실패", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>회원가입</Text>

        {/* 닉네임 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
          />
        </View>

        {/* 이메일 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* 비밀번호 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* 비밀번호 확인 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            value={passwordCheck}
            onChangeText={setPasswordCheck}
            secureTextEntry
          />
        </View>

        <Button title="회원가입" onPress={onSignUp} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>이미 계정이 있다면? 로그인 하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignUpScreen;