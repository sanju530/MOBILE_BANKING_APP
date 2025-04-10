import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import api from '../services/api';
import { GlobalStyles } from '../styles/GlobalStyles';

const BalanceScreen = ({ route }) => {
    const { accountId } = route.params;
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await api.get(`/accounts/${accountId}/balance`);
                setBalance(response.data.balance);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch balance');
            }
        };
        fetchBalance();
    }, [accountId]);

    return (
        <View style={GlobalStyles.container}>
            {balance !== null ? (
                <Text>Balance: ${balance}</Text>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

export default BalanceScreen;