import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import PostListScreen from './src/screens/posts/PostListScreen';
import PostWriteScreen from './src/screens/posts/PostWriteScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "로그인" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "회원가입" }}
          />
          <Stack.Screen
            name="PostList"
            component={PostListScreen}
            options={{ title: "모여라!" }}
          />
          <Stack.Screen
            name="PostWrite"
            component={PostWriteScreen}
            options={{ title: "글 작성" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

