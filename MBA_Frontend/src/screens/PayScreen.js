import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';
import { GlobalStyles } from '../styles/GlobalStyles';

const PayScreen = ({ route, navigation }) => {
    const { accountId } = route.params;
    const [toUpiId, setToUpiId] = useState('');
    const [amount, setAmount] = useState('');

    const handlePay = async () => {
        try {
            await api.post('/transactions/upi/pay', { fromAccountId: accountId, toUpiId, amount: parseFloat(amount) });
            Alert.alert('Success', 'Payment successful');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Payment failed');
        }
    };

    return (
        <View style={GlobalStyles.container}>
            <TextInput
                placeholder="Recipient UPI ID"
                value={toUpiId}
                onChangeText={setToUpiId}
                style={GlobalStyles.input}
            />
            <TextInput
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={GlobalStyles.input}
            />
            <Button title="Pay" onPress={handlePay} />
        </View>
    );
};

export default PayScreen;