import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RateUsScreen = () => {
  const [rating, setRating] = useState(0);

  const handleRate = (stars) => {
    setRating(stars);
    alert(`Thank you for rating us ${stars} stars!`);
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