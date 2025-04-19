import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const TransactionHistoryScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No userId found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await api.get(`/api/transactions/${userId}`);
      if (validateResponse(response, 'array')) {
        setTransactions(response.data || []);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err.response ? err.response.data : err.message);
      Alert.alert('Error', 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchTransactions();
    });

    return unsubscribe;
  }, [fetchTransactions, navigation]);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <LinearGradient
        colors={['#4a69bd', '#6a89cc']}
        style={styles.transactionGradient}
      >
        <View style={styles.transactionContent}>
          <View>
            <Text style={styles.transactionType}>{item.transactionType || 'N/A'}</Text>
            <Text style={styles.transactionDate}>
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionAmount}>
              ${item.amount ? item.amount.toFixed(2) : '0.00'}
            </Text>
            <Text style={styles.transactionStatus}>{item.status || 'N/A'}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Transaction History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4a69bd" style={styles.loader} />
      ) : transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noTransactionsText}>No transactions found.</Text>
      )}
    </View>
  );
};

// Assuming validateResponse is imported from api.js
const validateResponse = (response, expectedType = 'object') => {
  if (!response || !response.data) {
    console.warn('Invalid response format');
    return false;
  }
  if (expectedType === 'array' && !Array.isArray(response.data)) {
    console.warn('Expected array but got:', typeof response.data);
    return false;
  }
  if (expectedType === 'object' && (typeof response.data !== 'object' || Array.isArray(response.data))) {
    console.warn('Expected object but got:', typeof response.data);
    return false;
  }
  return true;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 16 },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 20 },
  loader: { flex: 1, justifyContent: 'center' },
  list: { paddingBottom: 20 },
  transactionCard: { marginBottom: 15, borderRadius: 12, elevation: 3, overflow: 'hidden' },
  transactionGradient: { padding: 15 },
  transactionContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  transactionDetails: { alignItems: 'flex-end' },
  transactionType: { fontSize: 16, fontWeight: '600', color: '#fff' },
  transactionDate: { fontSize: 12, color: '#ecf0f1', marginTop: 4 },
  transactionAmount: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  transactionStatus: { fontSize: 12, color: '#fff', marginTop: 4 },
  noTransactionsText: { textAlign: 'center', color: '#7f8c8d', fontSize: 16, marginTop: 20 },
});

export default TransactionHistoryScreen;