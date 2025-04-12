// src/screens/DashboardScreen.js
import React, { useEffect, useState, useRef } from 'react';
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
import { useNavigation } from '@react-navigation/native'; // For navigation

const DashboardScreen = () => {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const drawerRef = useRef(null); // Ref for controlling the drawer
  const navigation = useNavigation(); // Hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = await AsyncStorage.getItem('username'); // Changed back to 'username' for consistency with prior login setup
      const storedToken = await AsyncStorage.getItem('token');
      setUsername(storedUsername);
      setToken(storedToken);
    };
    fetchData();
  }, []);

  // Side menu items
  const menuItems = [
    { id: '1', title: 'Profile', icon: require('../../assets/profile_icon.jpg'), onPress: () => { navigation.navigate('Profile'); drawerRef.current.closeDrawer(); } },
    { id: '2', title: 'Home', icon: require('../../assets/home_icon.jpeg'), onPress: () => drawerRef.current.closeDrawer() },
    { id: '3', title: 'Receive Money', icon: require('../../assets/qr_icon.jpeg'), onPress: () => { navigation.navigate('ReceiveMoney'); drawerRef.current.closeDrawer(); } },
    { id: '4', title: 'Feedback', icon: require('../../assets/feedback_icon.jpeg'), onPress: () => { navigation.navigate('Feedback'); drawerRef.current.closeDrawer(); } },
    { id: '5', title: 'Rate Us', icon: require('../../assets/star_icon.png'), onPress: () => { navigation.navigate('RateUs'); drawerRef.current.closeDrawer(); } },
    { id: '6', title: 'Logout', icon: require('../../assets/logout_icon.jpeg'), onPress: handleLogout },
  ];

  // Logout function
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // Drawer content
  const renderDrawerContent = () => (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Image
          source={require('../../assets/profile_icon.jpg')} // Replace with actual profile icon
          style={styles.profileIcon}
        />
        <Text style={styles.drawerUsername}>{username || 'User'}</Text>
      </View>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
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
    >
      <View style={styles.container}>
        {/* Top Bar with Menu Icon and Logo */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => drawerRef.current.openDrawer()}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Image
            source={require('../../assets/logo.jpeg')} // Replace with your logo
            style={styles.logo}
          />
          <View style={{ width: 30 }} /> {/* Spacer for symmetry */}
        </View>

        {/* Header */}
        <Text style={styles.headerText}>Hello, {username ? `\n${username}` : 'User'}</Text>

        {/* Original Content */}
        <Text style={styles.welcomeText}>
          Welcome to {username ? username : 'User'}'s Dashboard
        </Text>
        <Text>Token: {token || 'Loading...'}</Text>

        {/* Dashboard Buttons */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Accounts')}>
          <Text style={styles.buttonText}>Accounts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CheckBalance')}>
          <Text style={styles.buttonText}>Check Balance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FundTransfer')}>
          <Text style={styles.buttonText}>Fund Transfer</Text>
        </TouchableOpacity>

        {/* Bottom Scan QR Button (Inspired by Image) */}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f4f8', // Light blue background for a modern feel
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50', // Darker text for readability
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4, // Shadow for Android
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuIcon: {
    fontSize: 30,
    color: '#2c3e50',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2980b9', // Blue header text
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db', // Soft blue for buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanQRButton: {
    flexDirection: 'row',
    backgroundColor: '#1abc9c', // Cyan from the image
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    elevation: 5,
  },
  qrIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  scanQRText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  drawerUsername: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#2c3e50',
  },
});

export default DashboardScreen;