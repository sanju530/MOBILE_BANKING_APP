import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const RateUsScreen = () => {
  const [rating, setRating] = useState(0);

  const handleRate = async (stars) => {
    setRating(stars);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User not logged in');
        return;
      }
      const payload = { userId: parseInt(userId), rating: stars };
      const response = await api.post('/api/rating', payload);
      Alert.alert('Success', response.data);
    } catch (error) {
      console.error('Rating error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Us</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            title={star.toString()}
            onPress={() => handleRate(star)}
            color={star <= rating ? '#ffd700' : '#ccc'}
          />
        ))}
      </View>
      <Text style={styles.ratingText}>Current Rating: {rating} stars</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 18,
    color: '#34495e',
    textAlign: 'center',
  },
});

export default RateUsScreen;