import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ScanQRScreen from '../screens/QRScanner'; // Adjust if file name differs
import PaymentScreen from '../screens/PaymentScreen';
import AccountsScreen from '../screens/AccountsScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import FundTransferScreen from '../screens/FundTransferScreen';
import SelfTransferScreen from '../screens/SelfTransferScreen';
import TransferToOthersScreen from '../screens/TransferToOthersScreen';
import BankAccountList from '../screens/BankAccountList';
import LoanApplication from '../screens/LoanApplication';
import ProfileScreen from '../screens/ProfileScreen';
import ReceiveMoneyScreen from '../screens/ReceiveMoneyScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import RateUsScreen from '../screens/RateUsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
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
      <Stack.Screen name="ScanQR" component={ScanQRScreen} options={{ title: 'Scan QR Code' }} />
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

export default AppNavigator;