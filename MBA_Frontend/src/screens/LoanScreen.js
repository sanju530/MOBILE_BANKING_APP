import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';
import { GlobalStyles } from '../styles/GlobalStyles';

const LoanScreen = ({ route, navigation }) => {
    const { accountId } = route.params;
    const [loanAmount, setLoanAmount] = useState('');
    const [terms, setTerms] = useState('');

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        try {
            const response = await api.get('/loans/terms');
            setTerms(response.data.terms);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch terms');
        }
    };

    const handleApplyLoan = async () => {
        try {
            await api.post('/loans/apply', { accountId, loanAmount: parseFloat(loanAmount) });
            Alert.alert('Success', 'Loan applied successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Loan application failed');
        }
    };

    return (
        <View style={GlobalStyles.container}>
            <TextInput
                placeholder="Loan Amount"
                value={loanAmount}
                onChangeText={setLoanAmount}
                keyboardType="numeric"
                style={GlobalStyles.input}
            />
            <Button title="Apply for Loan" onPress={handleApplyLoan} />
            {terms ? (
                <Text style={styles.terms}>Terms: {terms}</Text>
            ) : (
                <Text>Loading terms...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    terms: {
        marginTop: 20,
        fontSize: 14,
    },
});

export default LoanScreen;