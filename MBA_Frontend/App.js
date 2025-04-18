import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AccountsScreen from './src/screens/AccountsScreen';
import AddAccountScreen from './src/screens/AddAccountScreen';
import FundTransferScreen from './src/screens/FundTransferScreen';
import SelfTransferScreen from './src/screens/SelfTransferScreen';
import TransferToOthersScreen from './src/screens/TransferToOthersScreen';
import QRScanner from './src/screens/QRScanner';
import PaymentScreen from './src/screens/PaymentScreen';
import BankAccountList from './src/screens/BankAccountList';
import LoanApplication from './src/screens/LoanApplication';
import ProfileScreen from './src/screens/ProfileScreen';
import ReceiveMoneyScreen from './src/screens/ReceiveMoneyScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import RateUsScreen from './src/screens/RateUsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Accounts" component={AccountsScreen} options={{ title: 'Accounts' }} />
        <Stack.Screen name="AddAccount" component={AddAccountScreen} options={{ title: 'Add Account' }} />
        <Stack.Screen name="FundTransfer" component={FundTransferScreen} options={{ title: 'Fund Transfer' }} />
        <Stack.Screen name="SelfTransfer" component={SelfTransferScreen} options={{ title: 'Self Transfer' }} />
        <Stack.Screen name="TransferToOthers" component={TransferToOthersScreen} options={{ title: 'Transfer to Others' }} />
        <Stack.Screen name="ScanQR" component={QRScanner} options={{ title: 'Scan QR Code' }} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ title: 'Make Payment' }} />
        <Stack.Screen name="BankAccountList" component={BankAccountList} />
        <Stack.Screen name="LoanApplication" component={LoanApplication} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="ReceiveMoney" component={ReceiveMoneyScreen} options={{ title: 'Receive Money' }} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Feedback' }} />
        <Stack.Screen name="RateUs" component={RateUsScreen} options={{ title: 'Rate Us' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;