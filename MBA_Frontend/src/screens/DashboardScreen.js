import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  DrawerLayoutAndroid,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedToken = await AsyncStorage.getItem('token');
      setUsername(storedUsername);
      setToken(storedToken);
    };
    fetchData();
  }, []);

  const closeDrawerSafely = useCallback(() => {
    if (drawerRef.current && isDrawerOpen) {
      drawerRef.current.closeDrawer();
      setIsDrawerOpen(false);
    }
  }, [isDrawerOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('username');
      closeDrawerSafely();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [closeDrawerSafely, navigation]);

  const menuItems = useMemo(() => [
    { id: '1', title: 'Profile', icon: require('../../assets/profile_icon.jpg'), onPress: () => { navigation.navigate('Profile'); closeDrawerSafely(); } },
    { id: '3', title: 'Receive Money', icon: require('../../assets/qr_icon.jpeg'), onPress: () => { navigation.navigate('ReceiveMoney'); closeDrawerSafely(); } },
    { id: '4', title: 'Feedback', icon: require('../../assets/feedback_icon.jpeg'), onPress: () => { navigation.navigate('Feedback'); closeDrawerSafely(); } },
    { id: '5', title: 'Rate Us', icon: require('../../assets/star_icon.png'), onPress: () => { navigation.navigate('RateUs'); closeDrawerSafely(); } },
    { id: '6', title: 'Logout', icon: require('../../assets/logout_icon.jpeg'), onPress: handleLogout },
  ], [navigation, closeDrawerSafely, handleLogout]);

  const renderDrawerContent = () => (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Image
          source={require('../../assets/profile_icon.jpg')}
          style={styles.profileIcon}
        />
        <Text style={styles.drawerUsername}>{username || 'User'}</Text>
      </View>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Image source={item.icon} style={styles.menuIcon} />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={renderDrawerContent}
      onDrawerSlide={(e) => setIsDrawerOpen(e.nativeEvent.offset > 0)}
      onDrawerClose={() => setIsDrawerOpen(false)}
      onDrawerOpen={() => setIsDrawerOpen(true)}
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => drawerRef.current?.openDrawer()}>
            <Text style={styles.menuIconText}>☰</Text>
          </TouchableOpacity>
          <Image
            source={require('../../assets/logo.jpeg')}
            style={styles.logo}
          />
          <View style={{ width: 30 }} />
        </View>
        <Text style={styles.headerText}>Hello, {username ? `\n${username}` : 'User'}</Text>
        <Text style={styles.welcomeText}>
          Welcome to {username ? username : 'User'}'s Dashboard
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Accounts')}>
            <Text style={styles.buttonText}>Accounts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FundTransfer')}>
            <Text style={styles.buttonText}>Fund Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BankAccountList')}>
            <Text style={styles.buttonText}>Apply Loan</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.scanQRButton}
          onPress={() => navigation.navigate('ScanQR')}
        >
          <Image source={require('../../assets/qr_icon.jpeg')} style={styles.qrIcon} />
          <Text style={styles.scanQRText}>SCAN QR</Text>
        </TouchableOpacity>
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    borderRadius: 10,
  },
  menuIconText: {
    fontSize: 32,
    color: '#2c3e50',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2980b9',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scanQRButton: {
    flexDirection: 'row',
    backgroundColor: '#1abc9c',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  qrIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  scanQRText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#ecf0f1',
    backgroundColor: '#f0f4f8',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  drawerUsername: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: 18,
    color: '#2c3e50',
  },
});

export default DashboardScreen;