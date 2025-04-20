import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const FundTransferScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1e3c72" />
      
      {/* Header with dark blue background */}
      <LinearGradient 
        colors={['#1e3c72', '#2a5298']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        
        <Text style={styles.headerText}>Fund Transfer</Text>
      </LinearGradient>

      {/* White content area */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SelfTransfer')}
          activeOpacity={0.9}
        >
          <LinearGradient 
            colors={['#3498db', '#2980b9']} 
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="swap-horizontal" size={24} color="#fff" />
            </View>
            <Text style={styles.cardText}>Self Transfer</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" style={styles.cardArrow} />
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('TransferToOthers')}
          activeOpacity={0.9}
        >
          <LinearGradient 
            colors={['#e74c3c', '#c0392b']} 
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="people" size={24} color="#fff" />
            </View>
            <Text style={styles.cardText}>Transfer to Others</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" style={styles.cardArrow} />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Choose a transfer type to continue
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    marginVertical: 16,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardArrow: {
    marginLeft: 8,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FundTransferScreen;
