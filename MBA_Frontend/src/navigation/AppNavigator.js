import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ScanQRScreen from '../screens/ScanQRScreen'; // Import ScanQRScreen
import PaymentScreen from '../screens/PaymentScreen'; // Import PaymentScreen

const Stack = createStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="ScanQR" component={ScanQRScreen} /> {/* Add ScanQRScreen */}
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} /> {/* Add PaymentScreen */}
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
