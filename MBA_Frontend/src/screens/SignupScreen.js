import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';

const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState('');

    const handleSignup = async () => {
        const payload = {
            name: username,
            email,
            password,
            contactNumber,
            address,
            dob,
        };

        console.log('Signup attempt:', payload);

        try {
            const response = await api.post('/auth/signup', payload, { timeout: 5000 });
            console.log('Signup response:', response.data);
            Alert.alert('Success', 'Signup successful! Please login.');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Signup error:', error.message);
            Alert.alert('Error', 'Signup failed: ' + error.message);
        }
    };

    return (
        <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Create Account</Text>

                        <TextInput
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            style={styles.input}
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            placeholder="Contact Number"
                            value={contactNumber}
                            onChangeText={setContactNumber}
                            keyboardType="phone-pad"
                            style={styles.input}
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            placeholder="Address"
                            value={address}
                            onChangeText={setAddress}
                            style={styles.input}
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            placeholder="Date of Birth (YYYY-MM-DD)"
                            value={dob}
                            onChangeText={setDob}
                            style={styles.input}
                            placeholderTextColor="#666"
                        />

                        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
                            <Text style={styles.signupText}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={styles.backBtn}
                        >
                            <Text style={styles.backText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    signupBtn: {
        backgroundColor: '#4facfe',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    signupText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    backBtn: {
        marginTop: 15,
        alignItems: 'center',
    },
    backText: {
        color: '#007bff',
        fontSize: 14,
    },
});

export default SignupScreen;
