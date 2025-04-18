import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const TransferToOthersScreen = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await api.get(`/account/user/${userId}`);
        setAccounts(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load your accounts');
      }
    };
    fetchAccounts();
  }, []);

  const handleTransfer = async () => {
    if (!fromAccount || !toAccountNumber || !amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please select a From account, enter a To account number, and a valid amount');
      return;
    }
    try {
      const userId = await AsyncStorage.getItem('userId');
      const toAccountResponse = await api.get(`/api/account/${toAccountNumber}/id`);
      const toAccountId = toAccountResponse.data;

      const payload = {
        userId: parseInt(userId),
        fromAccountNumber: fromAccount.accountNumber,
        toAccountNumber: toAccountNumber, // Send toAccountNumber for mapping
        amount: parseFloat(amount),
        transactionType: 'TRANSFER_TO_OTHERS',
      };
      console.log('Sending transfer payload:', payload); // Debug log
      const response = await api.post('/api/transaction', payload); // Use /api/transaction
      console.log('Transfer response:', response.data); // Debug log
      Alert.alert('Success', response.data);
      navigation.navigate('TransactionHistory'); // Navigate to history to refresh
    } catch (error) {
      console.error('Transfer error details:', {
        message: error.message,
        response: error.response ? error.response.data : 'No response data',
        status: error.response ? error.response.status : 'No status',
        url: error.response ? error.response.config.url : 'No URL',
      }); // Detailed debug log
      Alert.alert('Error', error.response?.data?.message || 'Transfer failed');
    }
  };

  const renderFromAccount = ({ item }) => (
    <TouchableOpacity
      style={[styles.accountItem, fromAccount?.id === item.id && styles.selectedItem]}
      onPress={() => setFromAccount(item)}
    >
      <Text>{item.bankName} - {item.accountNumber}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer to Others</Text>
      <Text style={styles.subtitle}>Select From Account</Text>
      <FlatList
        data={accounts}
        renderItem={renderFromAccount}
        keyExtractor={(item) => item.id.toString()}
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
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  accountItem: { padding: 10, backgroundColor: '#fff', marginBottom: 5, borderRadius: 5 },
  selectedItem: { backgroundColor: '#d3e0ea' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default TransferToOthersScreen;