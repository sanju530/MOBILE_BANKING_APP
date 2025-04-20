import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import TransactionPayloadFactory from '../services/TransactionPayloadFactory';

const { width } = Dimensions.get('window');

const SelfTransferScreen = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUpi, setIsUpi] = useState(false); // Toggle for UPI mode
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        const response = await api.get(`/account/user/${userId}`);
        console.log('Fetched accounts:', response.data);
        setAccounts(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleTransfer = async () => {
    if (isUpi) {
      if (!fromAccount || !amount || parseFloat(amount) <= 0 || !upiId) {
        Alert.alert('Error', 'Please select an account, enter a valid amount, and provide a UPI ID');
        return;
      }
      setLoading(true);
      try {
        const payload = await TransactionPayloadFactory.createUpiPayload(fromAccount, amount, upiId);
        console.log('Sending UPI payload:', payload);
        const response = await api.post('/api/transaction', payload);
        console.log('UPI response:', response.data);
        Alert.alert('Success', 'UPI transaction completed successfully!');
        navigation.navigate('TransactionHistory');
      } catch (error) {
        console.error('UPI error:', error.response ? error.response.data : error.message);
        Alert.alert('Error', error.response?.data?.message || 'UPI transaction failed');
      } finally {
        setLoading(false);
      }
    } else {
      if (!fromAccount || !toAccount || !amount || parseFloat(amount) <= 0) {
        Alert.alert('Error', 'Please select accounts and enter a valid amount');
        return;
      }
      if (fromAccount.id === toAccount.id) {
        Alert.alert('Error', 'From and To accounts cannot be the same');
        return;
      }
      setLoading(true);
      try {
        const payload = await TransactionPayloadFactory.createSelfTransferPayload(fromAccount, toAccount, amount);
        console.log('Sending self-transfer payload:', payload);
        const response = await api.post('/api/transaction', payload);
        console.log('Self-transfer response:', response.data);
        Alert.alert('Success', 'Transfer completed successfully!');
        navigation.navigate('TransactionHistory');
      } catch (error) {
        console.error('Self-transfer error:', error.response ? error.response.data : error.message);
        Alert.alert('Error', error.response?.data?.message || 'Transfer failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderFromAccount = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 100} duration={500}>
      <TouchableOpacity
        style={[styles.accountCard, fromAccount?.id === item.id && styles.selectedCard]}
        onPress={() => setFromAccount(item)}
      >
        <View style={styles.bankIconContainer}>
          <Icon name="bank" size={24} color={fromAccount?.id === item.id ? '#0A3D62' : '#6B7280'} />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.bankName}>{item.bankName}</Text>
          <Text style={styles.accountNumber}>{item.accountNumber}</Text>
        </View>
        {fromAccount?.id === item.id && (
          <View style={styles.checkIconContainer}>
            <Icon name="check-circle" size={24} color="#0A3D62" />
          </View>
        )}
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderToAccount = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 100} duration={500}>
      <TouchableOpacity
        style={[styles.accountCard, toAccount?.id === item.id && styles.selectedCard]}
        onPress={() => setToAccount(item)}
      >
        <View style={styles.bankIconContainer}>
          <Icon name="bank-transfer" size={24} color={toAccount?.id === item.id ? '#0A3D62' : '#6B7280'} />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.bankName}>{item.bankName}</Text>
          <Text style={styles.accountNumber}>{item.accountNumber}</Text>
        </View>
        {toAccount?.id === item.id && (
          <View style={styles.checkIconContainer}>
            <Icon name="check-circle" size={24} color="#0A3D62" />
          </View>
        )}
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeIn" duration={800} style={styles.header}>
        <Text style={styles.headerTitle}>Transfer</Text>
        <Text style={styles.headerSubtitle}>Select transaction type</Text>
      </Animatable.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animatable.View animation="fadeInUp" delay={100} duration={800}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, !isUpi && styles.activeToggle]}
              onPress={() => setIsUpi(false)}
            >
              <Text style={!isUpi ? styles.activeText : styles.inactiveText}>Self Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, isUpi && styles.activeToggle]}
              onPress={() => setIsUpi(true)}
            >
              <Text style={isUpi ? styles.activeText : styles.inactiveText}>UPI</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} duration={800}>
          <Text style={styles.sectionTitle}>From Account</Text>
          <FlatList
            data={accounts}
            renderItem={renderFromAccount}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.accountsList}
            scrollEnabled={false}
          />
        </Animatable.View>

        {!isUpi && fromAccount && (
          <Animatable.View animation="fadeInUp" delay={300} duration={800}>
            <Text style={styles.sectionTitle}>To Account</Text>
            <FlatList
              data={accounts.filter((acc) => acc.id !== fromAccount.id)}
              renderItem={renderToAccount}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.accountsList}
              scrollEnabled={false}
            />
          </Animatable.View>
        )}

        <Animatable.View animation="fadeInUp" delay={400} duration={800} style={styles.amountContainer}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.inputWrapper}>
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
        </Animatable.View>

        {isUpi && (
          <Animatable.View animation="fadeInUp" delay={500} duration={800} style={styles.amountContainer}>
            <Text style={styles.sectionTitle}>UPI ID</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.amountInput}
                placeholder="e.g., user@upi"
                value={upiId}
                onChangeText={setUpiId}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </Animatable.View>
        )}
      </Animated.ScrollView>

      <Animatable.View animation="fadeInUp" delay={600} duration={800} style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleTransfer}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.buttonText}>Processing...</Text>
          ) : (
            <>
              <Icon name="send" size={20} color="#FFFFFF" style={styles.sendIcon} />
              <Text style={styles.buttonText}>Transfer Now</Text>
            </>
          )}
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    marginTop: 10,
  },
  accountsList: {
    marginBottom: 15,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#0A3D62',
    borderWidth: 2,
    shadowColor: '#0A3D62',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  bankIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  checkIconContainer: {
    marginLeft: 10,
  },
  amountContainer: {
    marginTop: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 5,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A3D62',
    paddingHorizontal: 10,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#111827',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: '#0A3D62',
    borderRadius: 30,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A3D62',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  sendIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: '#0A3D62',
    borderColor: '#0A3D62',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inactiveText: {
    color: '#6B7280',
  },
});

export default SelfTransferScreen;