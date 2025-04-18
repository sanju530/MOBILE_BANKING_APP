import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage'; // if you're using AsyncStorage

const FeedbackScreen = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const name = await AsyncStorage.getItem('username');
        setUserId(id);
        setUsername(name);
      } catch (e) {
        console.error('Error retrieving user info:', e);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      alert('Please enter some feedback');
      return;
    }

    try {
      await api.post('/api/feedback', {
        userId,
        username,
        feedbackText
      });
      alert('Feedback submitted successfully!');
      setFeedbackText('');
    } catch (error) {
      console.error(error);
      alert('Failed to submit feedback');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your feedback"
        value={feedbackText}
        onChangeText={setFeedbackText}
        multiline
      />
      <Button title="Submit Feedback" onPress={handleSubmit} />
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
  input: {
    height: 100,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    textAlignVertical: 'top',
  },
});

export default FeedbackScreen;
