import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [fromAccountNumber, setFromAccountNumber] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { toAccountNumber, displayAccount } = route.params;

  useEffect(() => {
    const fetchUserAccount = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await api.get(`/account/user/${userId}`);
        const userAccounts = response.data;

        if (userAccounts.length === 0) {
          Alert.alert('Error', 'You have no accounts to transfer from.');
          navigation.goBack();
          return;
        }

        const randomIndex = Math.floor(Math.random() * userAccounts.length);
        setFromAccountNumber(userAccounts[randomIndex].accountNumber);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch your account.');
        navigation.goBack();
      }
    };
    fetchUserAccount();
  }, []);

  const handlePay = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const payload = {
        userId: parseInt(userId),
        fromAccountId: (await api.get(`/account/accountNumber/${fromAccountNumber}`)).data.id, // Fetch account ID
        toAccountId: (await api.get(`/account/accountNumber/${toAccountNumber}`)).data.id, // Fetch account ID
        amount: parseFloat(amount),
        transactionType: 'TRANSFER_TO_OTHERS', // Adjust based on context
        status: 'COMPLETED',
      };
      console.log('Sending payment payload:', payload); // Debug log
      const response = await api.post('/api/transaction', payload); // Changed to /api/transaction
      console.log('Payment response:', response.data); // Debug log
      Alert.alert('Success', 'Payment successful! Balance updated.');
      navigation.navigate('TransactionHistory'); // Navigate to history
    } catch (error) {
      console.error('Payment error:', error.response ? error.response.data : error.message); // Debug log
      Alert.alert('Error', error.response?.data?.message || 'Payment failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Payment</Text>
      <Text style={styles.label}>To Account: {displayAccount}</Text>
      <Text style={styles.label}>From Account: {fromAccountNumber || 'Loading...'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handlePay}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ecf0f1' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 10 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default PaymentScreen;