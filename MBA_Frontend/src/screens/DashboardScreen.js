// src/screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = () => {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedToken = await AsyncStorage.getItem('token');
      setUsername(storedUsername);
      setToken(storedToken);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome to {username ? username : 'User'}'s Dashboard
      </Text>
      <Text>Token: {token || 'Loading...'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default DashboardScreen;