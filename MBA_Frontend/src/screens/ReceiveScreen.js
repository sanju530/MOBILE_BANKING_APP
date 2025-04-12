// src/screens/ReceiveMoney.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ReceiveMoney = () => {
  return (
    <View style={styles.container}>
    <Text style={styles.title}>Receive Money</Text>
    <Image
      source={{ uri: 'https://via.placeholder.com/200?text=QR+Code' }} // Replace with actual QR code
      style={styles.qrCode}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  qrCode: { width: 200, height: 200, borderRadius: 10 },
});

export default ReceiveMoney;