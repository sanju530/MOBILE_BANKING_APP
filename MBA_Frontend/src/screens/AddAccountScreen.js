import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AddAccountScreen = ({ route }) => {
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const navigation = useNavigation();
  const { message } = route.params || {};

  const handleAddAccount = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
      const payload = {
        bankName,
        bankCode, // Will be ignored unless backend supports it
        accountNumber,
        user: { id: parseInt(userId) },
      };
      const response = await api.post('/account/add', payload);
      console.log('Account added:', response.data);
      Alert.alert('Success', 'Account added successfully!');
      navigation.navigate('BankAccountList'); // Return to BankAccountList to refresh accounts
    } catch (error) {
      console.error('Error adding account:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to add account');
    }
  };

  return (
    <View style={styles.container}>
      {message && <Text style={styles.message}>{message}</Text>}
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
      <Button
        title="Add Account"
        onPress={handleAddAccount}
        disabled={!bankName || !accountNumber} // Require at least bankName and accountNumber
      />
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
  message: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});

export default AddAccountScreen;