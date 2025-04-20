import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const BankAccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.error('No userId found in AsyncStorage');
          return;
        }
        const response = await api.get(`/account/user/${userId}`);
        if (response.data.length === 0) {
          navigation.navigate('AddAccountScreen', {
            message: 'Please add a bank account to apply for a loan.',
          });
        } else {
          setAccounts(response.data);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const renderAccount = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.bankName}>{item.bankName}</Text>
      <Text style={styles.accountNumber}>A/C: {item.accountNumber}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('LoanApplication', {
            accountId: item.id,
            bankName: item.bankName,
            accountNumber: item.accountNumber,
          })
        }
      >
        <Text style={styles.buttonText}>Apply for Loan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Bank Accounts</Text>
      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bank accounts found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
    textAlign: 'center',
  },
  accountNumber: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default BankAccountList;
