// src/screens/AccountsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const AccountsScreen = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in storage');
        }
        const response = await api.get(`/account/user/${userId}`);
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        Alert.alert('Error', 'Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const renderAccount = ({ item }) => (
    <View style={styles.accountCard}>
      <Text style={styles.bankName}>{item.bankName}</Text>
      <Text style={styles.accountNumber}>Account: {item.accountNumber}</Text>
      <Text style={styles.balance}>Balance: ${item.balance.toFixed(2)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bank Accounts</Text>
      {accounts.length > 0 ? (
        <FlatList
          data={accounts}
          renderItem={renderAccount}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      ) : (
        <Text style={styles.noAccounts}>No accounts found. Add a new account below.</Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddAccount')}
      >
        <Text style={styles.addButtonText}>Add Bank Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  accountCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980b9',
  },
  accountNumber: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginTop: 5,
  },
  noAccounts: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 20,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginBottom: 20,
  },
});

export default AccountsScreen;