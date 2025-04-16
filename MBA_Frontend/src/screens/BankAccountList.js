import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
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
            message: 'Please add a bank account to apply for a loan.'
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
    <View style={styles.accountContainer}>
      <Text style={styles.accountInfo}>{item.bankName} - {item.accountNumber}</Text>
      <Button
        title="Apply for Loan"
        onPress={() => navigation.navigate('LoanApplication', {
          accountId: item.id,
          bankName: item.bankName,
          accountNumber: item.accountNumber,
        })}
        disabled={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No accounts found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9fafb',
  },
  accountContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: 100,
  },
  accountInfo: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: 20,
  },
});

export default BankAccountList;