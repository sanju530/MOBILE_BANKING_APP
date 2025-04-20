import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionPayloadFactory = {
  async createSelfTransferPayload(fromAccount, toAccount, amount) {
    const userId = await AsyncStorage.getItem('userId');
    return {
      userId: parseInt(userId),
      fromAccountNumber: fromAccount.accountNumber,
      toAccountNumber: toAccount.accountNumber,
      amount: parseFloat(amount),
      transactionType: 'SELF_TRANSFER',
      status: 'COMPLETED',
    };
  },

  async createTransferToOthersPayload(fromAccount, toAccountNumber, amount) {
    const userId = await AsyncStorage.getItem('userId');
    return {
      userId: parseInt(userId),
      fromAccountNumber: fromAccount.accountNumber,
      toAccountNumber: toAccountNumber,
      amount: parseFloat(amount),
      transactionType: 'TRANSFER_TO_OTHERS',
      status: 'COMPLETED',
    };
  },

  async createUpiPayload(fromAccount, amount, upiId) {
    const userId = await AsyncStorage.getItem('userId');
    return {
      userId: parseInt(userId),
      fromAccountNumber: fromAccount.accountNumber,
      amount: parseFloat(amount),
      transactionType: 'UPI',
      upiId: upiId,
      status: 'COMPLETED',
    };
  },
};

export default TransactionPayloadFactory;