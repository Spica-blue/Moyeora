import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import styles from "../../styles/LoginStyle";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    if(!email || !password){
      Alert.alert("로그인", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try{
      await signInWithEmailAndPassword(auth, email.trim(), password);

      Alert.alert("로그인 성공", "성공적으로 로그인되었습니다!");
      navigation.replace('PostList');
    } catch(error){
      console.log(error);
      Alert.alert("로그인 실패", error.message);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>모여라!</Text>
        
        <TextInput
          style={styles.input}
          placeholder='이메일'
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType='email-address'
        />

        <TextInput
          style={styles.input}
          placeholder='비밀번호'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title='로그인' onPress={onLogin} />
        
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>아직 계정이 없다면? 회원가입 하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen;