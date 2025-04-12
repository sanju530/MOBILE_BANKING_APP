// src/screens/AddAccountScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AddAccountScreen = ({ navigation }) => {
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleAddAccount = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
      const payload = {
        bankName,
        bankCode,
        accountNumber,
        user: { id: parseInt(userId) }, // Send user object with ID
      };
      const response = await api.post('/account/add', payload);
      console.log('Account added:', response.data);
      Alert.alert('Success', 'Account added successfully!');
      navigation.goBack(); // Return to AccountsScreen
    } catch (error) {
      console.error('Error adding account:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to add account');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Bank Name"
        value={bankName}
        onChangeText={setBankName}
        style={styles.input}
      />
      <TextInput
        placeholder="Bank Code"
        value={bankCode}
        onChangeText={setBankCode}
        style={styles.input}
      />
      <TextInput
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        style={styles.input}
      />
      <Button title="Add Account" onPress={handleAddAccount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default AddAccountScreen;