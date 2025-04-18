import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReceiveMoneyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receive Money</Text>
      <Text style={styles.text}>This screen is under development. Functionality will be added soon.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default ReceiveMoneyScreen;