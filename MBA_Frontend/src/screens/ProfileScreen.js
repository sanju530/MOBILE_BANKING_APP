import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bankName, setBankName] = useState('Not linked');
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedEmail = await AsyncStorage.getItem('email');
        const userId = await AsyncStorage.getItem('userId');

        console.log('Fetched data - Username:', storedUsername, 'Email from storage:', storedEmail, 'UserId:', userId);

        setUsername(storedUsername || 'User');
        setEmail(storedEmail || 'Not set'); // Should show shiva@gmail.com

        if (userId) {
          const response = await api.get(`/account/user/${userId}`);
          if (response.data.length > 0) {
            setBankName(response.data[0].bankName || 'Not linked');
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Profile</Text>
    <Text style={styles.info}>Username: {username}</Text>
    <Text style={styles.info}>Email: {email}</Text>
    <Text style={styles.info}>Bank Name: {bankName}</Text>
    <Text style={styles.info}>Language: {language}</Text>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: '#34495e',
    marginVertical: 5,
  },
});

export default ProfileScreen;