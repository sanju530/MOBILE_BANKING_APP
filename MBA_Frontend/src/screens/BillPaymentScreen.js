import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Install: npm install @react-native-picker/picker
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const BillPaymentScreen = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [customerId, setCustomerId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [rrNumber, setRrNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await api.get(`/account/user/${userId}`);
          if (response.data && response.data.length > 0) {
            setAccounts(response.data);
            setSelectedAccount(response.data[0].accountNumber); // Default to first account
          }
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const handlePay = async () => {
    if (!selectedOption || !amount || parseFloat(amount) <= 0 || !selectedAccount) {
      Alert.alert('Error', 'Please select a bill type, enter a valid amount, and choose an account');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const payload = {
        userId: parseInt(userId),
        fromAccountNumber: selectedAccount,
        toAccountNumber: null,
        amount: parseFloat(amount),
        transactionType: 'BILL_PAYMENT',
        billingType: selectedOption,
        ...(selectedOption === 'ELECTRICITY' && { customerId }),
        ...(selectedOption === 'RENT' && { propertyName }),
        ...(selectedOption === 'WATER' && { rrNumber }),
      };
      console.log('Sending bill payment payload:', payload);
      const response = await api.post('/api/transaction', payload);
      console.log('Bill payment response:', response.data);
      Alert.alert('Success', response.data);
      navigation.navigate('TransactionHistory');
    } catch (error) {
      console.error('Bill payment error:', error.response ? error.response.data : error.message);
      Alert.alert('Alert', error.response?.data?.message || 'Insufficient balance');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bill Payment Options</Text>
      <TouchableOpacity
        style={[styles.optionButton, selectedOption === 'ELECTRICITY' && styles.selectedOption]}
        onPress={() => setSelectedOption('ELECTRICITY')}
      >
        <Text>Electricity Bill</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, selectedOption === 'RENT' && styles.selectedOption]}
        onPress={() => setSelectedOption('RENT')}
      >
        <Text>Rent</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, selectedOption === 'WATER' && styles.selectedOption]}
        onPress={() => setSelectedOption('WATER')}
      >
        <Text>Water Bill</Text>
      </TouchableOpacity>

      {selectedOption && (
        <View style={styles.paymentForm}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Account</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedAccount}
                onValueChange={(itemValue) => setSelectedAccount(itemValue)}
                style={styles.picker}
              >
                {accounts.map((account) => (
                  <Picker.Item
                    key={account.accountNumber}
                    label={`${account.accountNumber} (${account.bankName})`}
                    value={account.accountNumber}
                  />
                ))}
              </Picker>
            </View>
          </View>
          {selectedOption === 'ELECTRICITY' && (
            <TextInput
              style={styles.input}
              placeholder="Customer ID"
              value={customerId}
              onChangeText={setCustomerId}
            />
          )}
          {selectedOption === 'RENT' && (
            <TextInput
              style={styles.input}
              placeholder="Property Name"
              value={propertyName}
              onChangeText={setPropertyName}
            />
          )}
          {selectedOption === 'WATER' && (
            <TextInput
              style={styles.input}
              placeholder="RR Number"
              value={rrNumber}
              onChangeText={setRrNumber}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.payButton} onPress={handlePay}>
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f6fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  optionButton: { padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2 },
  selectedOption: { backgroundColor: '#4a69bd' },
  paymentForm: { marginTop: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 5 },
  payButton: { backgroundColor: '#1e3799', padding: 15, borderRadius: 8, alignItems: 'center' },
  payButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  pickerContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#fff' },
  picker: { height: 40, width: '100%' },
});

export default BillPaymentScreen;