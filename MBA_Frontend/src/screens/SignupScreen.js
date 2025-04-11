// src/screens/SignupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import api from '../services/api';


const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSignup = async () => {
        const payload = {
            name: username,
            email: email,
            password: password,
        };
        console.log('Signup attempt:', payload);
        try {
            const response = await api.post('/auth/signup', payload, {
                timeout: 5000, // Timeout to catch slow responses
            });            
            console.log('Signup response:', response.data);
            Alert.alert('Success', 'Signup successful! Please login.');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Signup error:', error.message, error.config);
            Alert.alert('Error', 'Signup failed: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <Button title="Signup" onPress={handleSignup} />
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
});

export default SignupScreen;