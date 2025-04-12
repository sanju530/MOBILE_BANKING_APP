// src/screens/AccountsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AccountsScreen = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleBalances, setVisibleBalances] = useState({}); // Tracks which balances are visible
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchAccounts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in storage');
      }
      const response = await api.get(`/account/user/${userId}`);
      setAccounts(response.data);
      // Set all balances to hidden by default
      const initialVisibility = {};
      response.data.forEach((account) => {
        initialVisibility[account.id] = false;
      });
      setVisibleBalances(initialVisibility);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      Alert.alert('Error', 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchAccounts();
    }
  }, [isFocused]);

  const toggleBalanceVisibility = (accountId) => {
    setVisibleBalances((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const renderAccount = ({ item }) => (
    <View style={styles.accountCard}>
      <Text style={styles.bankName}>{item.bankName}</Text>
      <Text style={styles.accountNumber}>Account: {item.accountNumber}</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balance}>
          Balance: {visibleBalances[item.id] ? `$${item.balance.toFixed(2)}` : '****'}
        </Text>
        <TouchableOpacity onPress={() => toggleBalanceVisibility(item.id)}>
          <Icon
            name={visibleBalances[item.id] ? 'visibility-off' : 'visibility'}
            size={20}
            color="#7f8c8d"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
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
  container: { flex: 1, padding: 20, backgroundColor: '#ecf0f1' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  accountCard: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8 },
  bankName: { fontSize: 18, fontWeight: 'bold' },
  accountNumber: { fontSize: 16, color: '#7f8c8d' },
  balance: { fontSize: 16, color: '#2ecc71' },
  balanceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyeIcon: { marginLeft: 10 },
  list: { flexGrow: 1 },
  noAccounts: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginTop: 20 },
  addButton: { backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default AccountsScreen;