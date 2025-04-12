// src/screens/TransferToOthersScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const TransferToOthersScreen = () => {
  const [fromAccountNumber, setFromAccountNumber] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();

  const handleTransfer = async () => {
    if (!fromAccountNumber || !toAccountNumber || !amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter valid account numbers and amount');
      return;
    }
    try {
      const payload = {
        fromAccountNumber,
        toAccountNumber,
        amount: parseFloat(amount),
      };
      const response = await api.post('/transaction/pay', payload);
      Alert.alert('Success', response.data);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data || 'Transfer failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer to Others</Text>
      <TextInput
        style={styles.input}
        placeholder="From Account Number"
        value={fromAccountNumber}
        onChangeText={setFromAccountNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="To Account Number"
        value={toAccountNumber}
        onChangeText={setToAccountNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleTransfer}>
        <Text style={styles.buttonText}>Transfer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#ecf0f1' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default TransferToOthersScreen;