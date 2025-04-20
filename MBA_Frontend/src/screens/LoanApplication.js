import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../services/api';

const loanTypeDetails = {
  personal: { maxLimit: 100000, interestRate: 7.0, termInMonths: 24 },
  home: { maxLimit: 500000, interestRate: 6.5, termInMonths: 120 },
  vehicle: { maxLimit: 300000, interestRate: 7.5, termInMonths: 36 },
  education: { maxLimit: 200000, interestRate: 6.0, termInMonths: 60 },
  medical: { maxLimit: 150000, interestRate: 8.0, termInMonths: 12 },
};

const validLoanTypes = Object.keys(loanTypeDetails); // ['personal', 'home', 'vehicle', 'education', 'medical']

const LoanApplication = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { accountId, bankName, accountNumber } = route.params;
  const [amount, setAmount] = useState('');
  const [loanType, setLoanType] = useState('personal'); // Default loan type
  const [instructions, setInstructions] = useState('');
  const [isLoanDisabled, setIsLoanDisabled] = useState(false);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await api.get('/loan/instructions', {
          headers: { 'User-Id': '59' } // Hardcoded for now, replace with dynamic user ID if available
        });
        setInstructions(response.data);
        console.log('Instructions fetched:', response.data); // Debug log
      } catch (error) {
        console.error('Error fetching instructions:', error);
      }
    };
    fetchInstructions();

    const checkLoanStatus = async () => {
      try {
        const response = await api.get('/loan/status', {
          headers: { 'User-Id': '59' } // Hardcoded for now, replace with dynamic user ID if available
        });
        setIsLoanDisabled(response.data.hasActiveLoan);
        if (response.data.hasActiveLoan) {
          Alert.alert('Alert', 'You have already taken a loan with another account. No further applications are allowed.');
        }
        console.log('Loan status:', response.data); // Debug log
      } catch (error) {
        console.error('Error checking loan status:', error);
      }
    };
    checkLoanStatus();
  }, []);

  const { maxLimit, interestRate, termInMonths } = loanTypeDetails[loanType.toLowerCase()] || loanTypeDetails.personal;

  const handleApplyLoan = async () => {
    const loanAmount = parseFloat(amount);

    // Validate loan type
    const normalizedLoanType = loanType.toLowerCase();
    if (!validLoanTypes.includes(normalizedLoanType)) {
      Alert.alert('Error', `Invalid loan type. Please enter one of: ${validLoanTypes.join(', ')}`);
      return;
    }

    if (loanAmount > maxLimit) {
      Alert.alert('Error', `Amount exceeds limit for ${normalizedLoanType} loan (₹${maxLimit})`);
      return;
    }

    const loanData = {
      account: { id: accountId },
      amount: loanAmount,
      loanType: normalizedLoanType,
    };

    try {
      const response = await api.post('/loan/apply', loanData, {
        headers: { 'User-Id': '59' } // Hardcoded for now, replace with dynamic user ID if available
      });
      Alert.alert('Success', 'Loan application submitted successfully!');
      setIsLoanDisabled(true);
      navigation.goBack();
      console.log('Loan applied response:', response.data); // Debug log
    } catch (error) {
      Alert.alert('Error', error.response?.data || 'Failed to apply loan');
      console.error('Loan apply error:', error.response?.data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Apply for Loan</Text>
      <Text style={styles.accountInfo}>{bankName} - {accountNumber}</Text>
      <Text style={styles.instructions}>{instructions}</Text>

      <Text style={styles.label}>Enter Loan Type (e.g., personal, home, vehicle, education, medical):</Text>
      <TextInput
        style={styles.input}
        value={loanType}
        onChangeText={setLoanType}
        placeholder="Type loan type"
        editable={!isLoanDisabled}
      />
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>Max Limit: ₹{maxLimit}</Text>
        <Text style={styles.detailText}>Interest: {interestRate}%</Text>
        <Text style={styles.detailText}>Term: {termInMonths} months</Text>
      </View>

      <Text style={styles.label}>Loan Amount (Max ₹{maxLimit}):</Text>
      <TextInput
        style={styles.input}
        placeholder={`Enter amount up to ₹${maxLimit}`}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        editable={!isLoanDisabled}
      />
      <Button
        title="Apply for Loan"
        onPress={handleApplyLoan}
        disabled={isLoanDisabled || !amount || parseFloat(amount) > maxLimit}
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    height: 48,
    width: '100%',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default LoanApplication;