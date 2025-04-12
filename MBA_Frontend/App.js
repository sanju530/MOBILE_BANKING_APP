// App.js
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;