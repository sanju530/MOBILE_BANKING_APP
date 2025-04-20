import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

const TransferToOthersScreen = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        const response = await api.get(`/account/user/${userId}`);
        console.log('Fetched accounts:', response.data);
        setAccounts(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load your accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
    
    // Keyboard listeners to adjust UI when keyboard appears/disappears
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        // Scroll to the amount input when keyboard appears
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleTransfer = async () => {
    Keyboard.dismiss();
    
    if (!fromAccount || !toAccountNumber || !amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please select a From account, enter a To account number, and a valid amount');
      return;
    }
    
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const toAccountResponse = await api.get(`/api/account/${toAccountNumber}/id`);
      const toAccountId = toAccountResponse.data;

      const payload = {
        userId: parseInt(userId),
        fromAccountNumber: fromAccount.accountNumber,
        toAccountNumber: toAccountNumber,
        amount: parseFloat(amount),
        transactionType: 'TRANSFER_TO_OTHERS',
        status: 'COMPLETED',
      };
      console.log('Sending transfer payload:', payload);
      const response = await api.post('/api/transaction', payload);
      console.log('Transfer response:', response.data);
      
      Alert.alert('Success', 'Transfer completed successfully!');
      navigation.navigate('TransactionHistory');
    } catch (error) {
      console.error('Transfer error details:', {
        message: error.message,
        response: error.response ? error.response.data : 'No response data',
        status: error.response ? error.response.status : 'No status',
        url: error.response ? error.response.config.url : 'No URL',
      });
      Alert.alert('Error', error.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const renderFromAccount = ({ item }) => (
    <TouchableOpacity
      style={[styles.accountCard, fromAccount?.id === item.id && styles.selectedCard]}
      onPress={() => setFromAccount(item)}
    >
      <View style={styles.bankIconContainer}>
        <Icon name="bank" size={24} color={fromAccount?.id === item.id ? "#0A3D62" : "#6B7280"} />
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.bankName}>{item.bankName}</Text>
        <Text style={styles.accountNumber}>{item.accountNumber}</Text>
      </View>
      {fromAccount?.id === item.id && (
        <Icon name="check-circle" size={24} color="#0A3D62" />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Send Money To Others</Text>
            <View style={styles.headerRight} />
          </View>
          
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>Transfer to Others</Text>
              <Text style={styles.pageSubtitle}>Send money to external accounts</Text>
            </View>
          
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>From</Text>
              <FlatList
                data={accounts}
                renderItem={renderFromAccount}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Recipient Account</Text>
              <View style={styles.inputContainer}>
                <Icon name="account" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter account number"
                  value={toAccountNumber}
                  onChangeText={setToAccountNumber}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={[styles.section, styles.amountSection]}>
              <Text style={styles.sectionLabel}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            
            {/* Extra space to ensure amount field is visible when keyboard is open */}
            {keyboardVisible && <View style={styles.keyboardSpacer} />}
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.transferButton} 
              onPress={handleTransfer}
              disabled={loading}
            >
              <Icon name="arrow-right" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>Transfer Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A3D62',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCard: {
    borderColor: '#0A3D62',
    borderWidth: 2,
    backgroundColor: '#F0F7FF',
  },
  bankIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  accountNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  amountSection: {
    marginBottom: 40,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 60,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A3D62',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: '#111827',
    height: '100%',
  },
  keyboardSpacer: {
    height: 250, // Adjust height as needed to keep amount field visible
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  transferButton: {
    backgroundColor: '#0A3D62',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    shadowColor: '#0A3D62',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  }
});

export default TransferToOthersScreen;