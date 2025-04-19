import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const payload = { email, password };
    console.log('Login attempt:', payload);
    try {
      const response = await api.post('/auth/login', payload, { timeout: 5000 });
      console.log('Login response:', response.data);
      const { token, name, userId } = response.data;

      if (!token || !name) {
        throw new Error("Invalid response from server");
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('username', name);
      await AsyncStorage.setItem('userId', userId.toString());
      await AsyncStorage.setItem('email', email);

      Alert.alert('Success', 'Login successful!');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert('Error', 'Login failed: ' + (error.response?.data || error.message));
    }
  };

  return (
    <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#666"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#666"
            />

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupBtn}>
              <Text style={styles.signupText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  loginBtn: {
    backgroundColor: '#0072ff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupBtn: {
    marginTop: 15,
    alignItems: 'center',
  },
  signupText: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default LoginScreen;
