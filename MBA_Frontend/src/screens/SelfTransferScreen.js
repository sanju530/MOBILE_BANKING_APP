// src/screens/SelfTransferScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const SelfTransferScreen = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await api.get(`/account/user/${userId}`); // Adjust endpoint if needed
        setAccounts(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load accounts');
      }
    };
    fetchAccounts();
  }, []);

  const handleTransfer = async () => {
    if (!fromAccount || !toAccount || !amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please select accounts and enter a valid amount');
      return;
    }
    try {
      const payload = {
        fromAccountNumber: fromAccount.accountNumber,
        toAccountNumber: toAccount.accountNumber,
        amount: parseFloat(amount),
      };
      const response = await api.post('/transaction/pay', payload);
      Alert.alert('Success', response.data);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data || 'Transfer failed');
    }
  };

  const renderAccount = ({ item }) => (
    <TouchableOpacity
      style={styles.accountItem}
      onPress={() => (fromAccount ? setToAccount(item) : setFromAccount(item))}
    >
      <Text>{item.bankName} - {item.accountNumber} (₹{item.balance})</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select From Account</Text>
      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(item) => item.id.toString()}
      />
      {fromAccount && (
        <>
          <Text style={styles.title}>Select To Account</Text>
          <FlatList
            data={accounts.filter((acc) => acc.id !== fromAccount.id)}
            renderItem={renderAccount}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      )}
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
  container: { flex: 1, padding: 20, backgroundColor: '#ecf0f1' },
  title: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  accountItem: { padding: 10, backgroundColor: '#fff', marginBottom: 5, borderRadius: 5 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default SelfTransferScreen;