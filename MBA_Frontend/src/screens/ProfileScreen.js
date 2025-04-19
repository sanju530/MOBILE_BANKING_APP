import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Ensure the API URL is correct in this file
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNPickerSelect from 'react-native-picker-select';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    dob: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        console.log('Fetched userId:', userId);  // Debug: Log userId

        // If userId is not found, show an alert and stop the fetch
        if (!userId) {
          Alert.alert('Error', 'No userId found. Please log in again.');
          setLoading(false);
          return;
        }

        // Fetch user details from the API using the userId
        const response = await api.get(`/user/${userId}`);
        console.log('User data response:', response.data);  // Debug: Log the response data
        setUserDetails(response.data);

        // Fetch accounts associated with the user, handle 404 for no accounts
        try {
          const accountResponse = await api.get(`/account/user/${userId}`);
          console.log('Account data response:', accountResponse.data);  // Debug: Log account data
          setAccounts(accountResponse.data || []);
        } catch (accountErr) {
          if (accountErr.response && accountErr.response.status === 404) {
            console.log('No accounts found for user:', userId);
            setAccounts([]); // Set empty array if no accounts
          } else {
            throw accountErr; // Re-throw other errors
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err.response ? err.response.data : err.message);  // Detailed error logging
        if (err.response && err.response.status === 404) {
          Alert.alert('Error', 'User data not found on the server. Check backend endpoints.');
        } else {
          Alert.alert('Error', 'Failed to load user profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderDetail = (label, value) => (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  );

  const renderAccount = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.card}>
      <Icon name="bank" size={30} color="#1e3a8a" style={{ marginRight: 10 }} />
      <View>
        <Text style={styles.bankName}>Bank: {item.bankName}</Text>
        <Text style={styles.accountNumber}>A/C: {item.accountNumber}</Text>
      </View>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {renderDetail('Name', userDetails.name)}
      {renderDetail('Email', userDetails.email)}
      {renderDetail('Contact Number', userDetails.contactNumber)}
      {renderDetail('Address', userDetails.address)}
      {renderDetail('Date of Birth', userDetails.dob ? userDetails.dob.toString() : 'N/A')}

      <View style={styles.languageSwitcher}>
        <Text style={{ marginRight: 10 }}>Language:</Text>
        <RNPickerSelect
          value={language}
          onValueChange={value => setLanguage(value)}
          items={[
            { label: 'English', value: 'en' },
            { label: 'Kannada', value: 'kn' },
            { label: 'Hindi', value: 'hi' },
          ]}
          style={{
            inputIOS: styles.pickerInput,
            inputAndroid: styles.pickerInput,
          }}
        />
      </View>

      <Text style={[styles.title, { fontSize: 18, marginTop: 20 }]}>Your Bank Accounts</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 30 }} />
      ) : accounts.length > 0 ? (
        <FlatList
          data={accounts}
          renderItem={renderAccount}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noAccountsText}>No accounts found.</Text>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddAccount')}
      >
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    elevation: 1,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  value: {
    flex: 1,
    color: '#374151',
  },
  languageSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerInput: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    width: 140,
  },
  list: { paddingBottom: 80 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  accountNumber: {
    fontSize: 14,
    color: '#4b5563',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 30,
    elevation: 5,
  },
  noAccountsText: {
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 20,
  },
});

export default ProfileScreen;