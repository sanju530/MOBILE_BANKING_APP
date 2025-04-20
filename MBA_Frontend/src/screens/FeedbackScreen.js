import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        feedbackText,
      });
      alert('Feedback submitted successfully!');
      setFeedbackText('');
    } catch (error) {
      console.error(error);
      alert('Failed to submit feedback');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>We value your thoughts</Text>
        <Text style={styles.subtitle}>✨Share your feedback ✨</Text>

        <TextInput
          style={styles.input}
          placeholder="Type your feedback here..."
          value={feedbackText}
          onChangeText={setFeedbackText}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
  },
  innerContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 120,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#f8fafc',
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeedbackScreen;
