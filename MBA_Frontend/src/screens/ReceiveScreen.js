import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import api from '../services/api';
import { GlobalStyles } from '../styles/GlobalStyles';

const ReceiveScreen = ({ route }) => {
    const { accountId } = route.params;
    const [upiId, setUpiId] = useState('');

    useEffect(() => {
        const fetchUpiId = async () => {
            try {
                const response = await api.get(`/transactions/upi/qr/${accountId}`);
                setUpiId(response.data.upiId);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch UPI ID');
            }
        };
        fetchUpiId();
    }, [accountId]);

    return (
        <View style={GlobalStyles.container}>
            {upiId ? (
                <>
                    <Text>Your UPI ID: {upiId}</Text>
                    <QRCode value={upiId} size={200} />
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

export default ReceiveScreen;