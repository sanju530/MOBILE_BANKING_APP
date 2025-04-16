import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../services/api';

const LoanApplication = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { accountId, bankName, accountNumber } = route.params;
  const [amount, setAmount] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoanDisabled, setIsLoanDisabled] = useState(false);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await api.get('/loan/instructions');
        setInstructions(response.data);
      } catch (error) {
        console.error('Error fetching instructions:', error);
      }
    };
    fetchInstructions();

    // Check if loans are globally disabled
    const checkLoanStatus = async () => {
      try {
        const response = await api.get('/loan/status');
        setIsLoanDisabled(response.data.hasActiveLoan);
      } catch (error) {
        console.error('Error checking loan status:', error);
      }
    };
    checkLoanStatus();
  }, []);

  const handleApplyLoan = async () => {
    const loanData = {
      account: { id: accountId },
      amount: parseFloat(amount),
    };
    try {
      const response = await api.post('/loan/apply', loanData);
      Alert.alert('Success', 'Loan application submitted successfully!');
      setIsLoanDisabled(true); // Disable further applications
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data || 'Failed to apply loan');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Apply for Loan</Text>
      <Text style={styles.accountInfo}>{bankName} - {accountNumber}</Text>
      <Text style={styles.instructions}>{instructions}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter loan amount (max ₹100,000)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        editable={!isLoanDisabled}
      />
      <Button
        title="Apply for Loan"
        onPress={handleApplyLoan}
        disabled={isLoanDisabled || !amount || parseFloat(amount) > 100000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  accountInfo: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 20,
    fontWeight: '500',
  },
  instructions: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    height: 48,
    width: '100%',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});

export default LoanApplication;