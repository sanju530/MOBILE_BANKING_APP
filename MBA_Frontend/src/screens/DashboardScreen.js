import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  DrawerLayoutAndroid,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const [username, setUsername] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername);
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

  const quickActions = useMemo(() => [
    { id: '1', title: 'Transfer', icon: '💸', color: '#4a69bd', onPress: () => navigation.navigate('FundTransfer') },
    { id: '2', title: 'QR Pay', icon: '📱', color: '#6a89cc', onPress: () => navigation.navigate('ScanQR') },
    { id: '3', title: 'Accounts', icon: '💼', color: '#1e3799', onPress: () => navigation.navigate('Accounts') },
    { id: '4', title: 'Loans', icon: '🏦', color: '#0c2461', onPress: () => navigation.navigate('BankAccountList') },
  ], [navigation]);

  const additionalFeatures = useMemo(() => [
    { 
      id: '1', 
      title: 'Transaction History', 
      emoji: '📊', 
      subtitle: 'View your recent transactions',
      gradient: ['#00b894', '#00cec9'],
      onPress: () => navigation.navigate('TransactionHistory')
    },
    { 
      id: '2', 
      title: 'Bill Payment', 
      emoji: '📃', 
      subtitle: 'Pay utilities and other bills',
      gradient: ['#e17055', '#d63031'],
      onPress: () => navigation.navigate('BillPayment')
    },
  ], [navigation]);

  const renderDrawerContent = () => (
    <View style={styles.drawerContainer}>
      <LinearGradient colors={['#1e3799', '#4a69bd']} style={styles.drawerHeader}>
        <Image source={require('../../assets/profile_icon.jpg')} style={styles.profileIcon} />
        <View>
          <Text style={styles.drawerUsername}>{username || 'User'}</Text>
          <Text style={styles.drawerSubtitle}>Welcome back!</Text>
        </View>
      </LinearGradient>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuIconContainer}>
              <Image source={item.icon} style={styles.menuIcon} />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.drawerFooter}>
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </View>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={width * 0.75}
      drawerPosition="left"
      renderNavigationView={renderDrawerContent}
      onDrawerSlide={(e) => setIsDrawerOpen(e.nativeEvent.offset > 0)}
      onDrawerClose={() => setIsDrawerOpen(false)}
      onDrawerOpen={() => setIsDrawerOpen(true)}
    >
      <StatusBar backgroundColor="#1e3799" barStyle="light-content" />
      <View style={styles.container}>
        <LinearGradient colors={['#1e3799', '#4a69bd']} style={styles.headerGradient}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => drawerRef.current?.openDrawer()}>
              <Text style={styles.menuIconText}>☰</Text>
            </TouchableOpacity>
            <Image source={require('../../assets/logo.jpeg')} style={styles.logo} />
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.welcomeSection}>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.headerText}>{username || 'User'} 👋</Text>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={[styles.quickActionButton, { backgroundColor: action.color }]} 
                onPress={action.onPress}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresContainer}>
            {additionalFeatures.map((feature) => (
              <TouchableOpacity 
                key={feature.id} 
                style={styles.featureCard} 
                onPress={feature.onPress}
              >
                <LinearGradient colors={feature.gradient} style={styles.featureGradient}>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureText}>{feature.title}</Text>
                      <Text style={styles.featureSubtext}>{feature.subtitle}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  headerGradient: { paddingTop: 20, paddingBottom: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  menuIconText: { fontSize: 28, color: '#fff' },
  logo: { width: 40, height: 40, resizeMode: 'contain', borderRadius: 30, backgroundColor: '#fff' },
  notificationIcon: { fontSize: 24, color: '#fff' },
  welcomeSection: { paddingHorizontal: 20, paddingTop: 10 },
  greetingText: { fontSize: 18, color: '#dcdde1', fontWeight: '500' },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  contentContainer: { flex: 1, paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginTop: 30, marginBottom: 15 },
  quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  quickActionButton: { width: width / 4 - 25, height: width / 4 - 25, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  quickActionIcon: { fontSize: 24, marginBottom: 5, color: '#fff' },
  quickActionText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  featuresContainer: { marginBottom: 25 },
  featureCard: { borderRadius: 15, marginBottom: 15, elevation: 4, overflow: 'hidden' },
  featureGradient: { padding: 15 },
  featureContent: { flexDirection: 'row', alignItems: 'center' },
  featureEmoji: { fontSize: 28, marginRight: 15 },
  featureTextContainer: { flex: 1 },
  featureText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  featureSubtext: { fontSize: 12, color: '#fff', marginTop: 4 },
  drawerContainer: { flex: 1, backgroundColor: '#fff' },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  profileIcon: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  drawerUsername: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  drawerSubtitle: { fontSize: 14, color: '#ecf0f1' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  menuIconContainer: { width: 30, height: 30, marginRight: 15 },
  menuIcon: { width: '100%', height: '100%', resizeMode: 'contain' },
  menuText: { fontSize: 16, color: '#2d3436' },
  drawerFooter: { marginTop: 'auto', padding: 20 },
  versionText: { fontSize: 12, color: '#636e72', textAlign: 'center' },
});

export default DashboardScreen;
