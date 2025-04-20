import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import QRCode from 'react-native-qrcode-svg';
import { Picker } from '@react-native-picker/picker'; // Updated import

const ReceiveMoneyScreen = () => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await api.get(`/account/user/${userId}`);
          if (response.data && response.data.length > 0) {
            setAccounts(response.data);
            setAccountNumber(response.data[0].accountNumber); // Default to first account
          }
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const generateQR = async () => {
    if (!amount || parseFloat(amount) <= 0 || !accountNumber) {
      Alert.alert('Error', 'Please enter a valid amount and select an account');
      return;
    }
    try {
      const userId = await AsyncStorage.getItem('userId');
      const payload = { userId: parseInt(userId), accountNumber, amount: parseFloat(amount) };
      console.log('Sending receive request payload:', payload);
      const response = await api.post('/api/receive', payload);
      console.log('Receive request response:', response.data);
      setQrCode(response.data.qrCode); // Assume QR code is returned
      Alert.alert('Success', 'QR code generated');
    } catch (error) {
      console.error('QR generation error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to generate QR');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receive Money</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={accountNumber}
          onValueChange={(itemValue) => setAccountNumber(itemValue)}
          style={styles.picker}
        >
          {accounts.map((account) => (
            <Picker.Item
              key={account.accountNumber}
              label={account.accountNumber}
              value={account.accountNumber}
            />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={generateQR}>
        <Text style={styles.buttonText}>Generate QR</Text>
      </TouchableOpacity>
      {qrCode && <QRCode value={qrCode} size={200} style={styles.qrCode} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 5 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15 },
  picker: { height: 40, width: '100%' },
  button: { backgroundColor: '#1e3799', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  qrCode: { alignSelf: 'center', marginTop: 20 },
});

export default ReceiveMoneyScreen;