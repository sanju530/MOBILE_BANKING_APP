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
        const response = await api.get(`/account/user/${userId}`);
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
    if (fromAccount.id === toAccount.id) {
      Alert.alert('Error', 'From and To accounts cannot be the same');
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

  const renderFromAccount = ({ item }) => (
    <TouchableOpacity
      style={[styles.accountItem, fromAccount?.id === item.id && styles.selectedItem]}
      onPress={() => setFromAccount(item)}
    >
      <Text>{item.bankName} - {item.accountNumber} </Text>
    </TouchableOpacity>
  );

  const renderToAccount = ({ item }) => (
    <TouchableOpacity
      style={[styles.accountItem, toAccount?.id === item.id && styles.selectedItem]}
      onPress={() => setToAccount(item)}
    >
      <Text>{item.bankName} - {item.accountNumber} </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select From Account</Text>
      <FlatList
        data={accounts}
        renderItem={renderFromAccount}
        keyExtractor={(item) => item.id.toString()}
      />
      {fromAccount && (
        <>
          <Text style={styles.title}>Select To Account</Text>
          <FlatList
            data={accounts.filter((acc) => acc.id !== fromAccount.id)}
            renderItem={renderToAccount}
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
  selectedItem: { backgroundColor: '#d3e0ea' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default SelfTransferScreen;