// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        throw new Error('Invalid response from server');
      }

      const accountResponse = await api.get(`/account/user/${userId}`, { headers: { 'User-Id': userId } });
      const userAccounts = accountResponse.data;
      if (userAccounts.length === 0) {
        throw new Error('No accounts found for this user');
      }
      const accountNumber = userAccounts[0].accountNumber; // Use first account for simplicity

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('username', name);
      await AsyncStorage.setItem('userId', userId.toString());
      await AsyncStorage.setItem('accountNumber', accountNumber);
      Alert.alert('Success', 'Login successful!');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert('Error', 'Login failed: ' + (error.response?.data || error.message));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Signup" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8, borderRadius: 5 },
});

export default LoginScreen;