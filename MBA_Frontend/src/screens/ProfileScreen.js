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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNPickerSelect from 'react-native-picker-select';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserAndAccounts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const name = await AsyncStorage.getItem('username');
        const mail = await AsyncStorage.getItem('email');
        setUserName(name || 'User');
        setEmail(mail || 'user@example.com');

        if (userId) {
          const response = await api.get(`/account/user/${userId}`);
          setAccounts(response.data);
        } else {
          setAccounts([]);
        }
      } catch (err) {
        console.error('Error fetching user or accounts:', err);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndAccounts();
  }, []);

  const renderAccount = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      style={styles.card}
    >
      <View style={styles.iconWrapper}>
        <Icon name="bank" size={30} color="#1e3a8a" />
      </View>
      <View style={styles.details}>
        <Text style={styles.bankName}>Bank: {item.bankName}</Text>
        <Text style={styles.accountNumber}>A/C: {item.accountNumber}</Text>
      </View>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileInfo}>
        <Icon name="account-circle" size={50} color="#1e40af" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

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

      <Text style={[styles.title, { fontSize: 18, marginTop: 20 }]}>
        Your Bank Accounts
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={accounts}
          renderItem={renderAccount}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.list}
        />
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  email: {
    fontSize: 14,
    color: '#374151',
  },
  languageSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  list: {
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 15,
  },
  details: {
    flex: 1,
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
});

export default ProfileScreen;
