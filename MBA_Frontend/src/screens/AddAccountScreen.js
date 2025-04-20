import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const AddAccountScreen = ({ route }) => {
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const navigation = useNavigation();
  const { message } = route.params || {};

  const handleAddAccount = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');

      const payload = {
        bankName,
        bankCode,
        accountNumber,
        user: { id: parseInt(userId) },
      };

      const response = await api.post('/account/add', payload);
      console.log('Account added:', response.data);
      Alert.alert('Success', 'Account added successfully!');
      navigation.navigate('BankAccountList');
    } catch (error) {
      console.error('Error adding account:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to add account');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4c669f" />
      <LinearGradient colors={['#4c669f', '#3b5998']} style={styles.header}>
        <Text style={styles.headerText}>Enter Bank Details</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#f0f4f8' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {message && <Text style={styles.message}>{message}</Text>}

          <TextInput
            placeholder="Bank Name"
            value={bankName}
            onChangeText={setBankName}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="Bank Code"
            value={bankCode}
            onChangeText={setBankCode}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            style={styles.input}
            placeholderTextColor="#888"
            keyboardType="number-pad"
          />

          <TouchableOpacity
            onPress={handleAddAccount}
            disabled={!bankName || !accountNumber}
            style={[
              styles.button,
              { opacity: !bankName || !accountNumber ? 0.6 : 1 },
            ]}
          >
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Add Account</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  backButton: {
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    padding: 24,
    paddingTop: 32,
  },
  message: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default AddAccountScreen;
