import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const RateUsScreen = () => {
  const [selectedStar, setSelectedStar] = useState(null); // store selected star index

  const handleRate = async (star) => {
    setSelectedStar(star);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User not logged in');
        return;
      }
      const payload = { userId: parseInt(userId), rating: star };
      const response = await api.post('/api/rating', payload);
      Alert.alert('Success', response.data);
    } catch (error) {
      console.error('Rating error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 Rate Us 🌟</Text>
      <Text style={styles.subtitle}>How was your experience?</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRate(star)}
            style={styles.starButton}
          >
            <Text
              style={[
                styles.star,
                selectedStar === star ? styles.activeStar : styles.inactiveStar,
              ]}
            >
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.ratingText}>
        {selectedStar === null
          ? 'Tap a star to rate us!'
          : `You rated us ${selectedStar} star${selectedStar > 1 ? 's' : ''} ⭐`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // dark blue for contrast
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#cbd5e1',
    marginBottom: 30,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  starButton: {
    marginHorizontal: 5,
  },
  star: {
    fontSize: 40,
  },
  activeStar: {
    color: '#facc15', // golden
  },
  inactiveStar: {
    color: '#ffffff', // white default
  },
  ratingText: {
    fontSize: 16,
    color: '#f1f5f9',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RateUsScreen;
