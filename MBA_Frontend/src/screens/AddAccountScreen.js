import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';
import { GlobalStyles } from '../styles/GlobalStyles';

const AddAccountScreen = ({ navigation }) => {
    const [bankCode, setBankCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const handleAddAccount = async () => {
        try {
            await api.post('/accounts', { bankCode, bankName, accountNumber });
            Alert.alert('Success', 'Account added');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to add account');
        }
    };

    return (
        <View style={GlobalStyles.container}>
            <TextInput
                placeholder="Bank Code"
                value={bankCode}
                onChangeText={setBankCode}
                style={GlobalStyles.input}
            />
            <TextInput
                placeholder="Bank Name"
                value={bankName}
                onChangeText={setBankName}
                style={GlobalStyles.input}
            />
            <TextInput
                placeholder="Account Number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                style={GlobalStyles.input}
            />
            <Button title="Add Account" onPress={handleAddAccount} />
        </View>
    );
};

export default AddAccountScreen;