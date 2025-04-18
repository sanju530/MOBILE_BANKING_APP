import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const QRScanner = () => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = async ({ data , type }) => {
    if (!scanned) {
      setScanned(true);
      console.log('Scanning QR code, data:', data);
      try {
        console.log('Making API call to /account/' + data); // Confirm URL
        const response = await api.get(`/account/${data}`);
        console.log('API Response:', response.data);
        const { accountNumber } = response.data;

        if (!accountNumber) {
          Alert.alert('Error', 'Invalid account data received.');
          setScanned(false);
          return;
        }

        navigation.navigate('PaymentScreen', {
          toAccountNumber: accountNumber,
          displayAccount: `****${accountNumber.slice(-4)}`,
        });
      } catch (error) {
        console.log('API Error:', error.message);
        if (error.response) {
          console.log('Response Status:', error.response.status);
          console.log('Response Data:', error.response.data);
        } else if (error.request) {
          console.log('No response received:', error.request);
        } else {
          console.log('Error:', error.message);
        }
        Alert.alert('Error', 'Failed to fetch account details: ' + error.message);
        setScanned(false);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: { textAlign: 'center', marginTop: 20 },
  camera: { flex: 1 },
  buttonContainer: { position: 'absolute', bottom: 30, alignSelf: 'center' },
  button: { backgroundColor: 'black', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: 'white', fontSize: 16 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanArea: { width: 250, height: 250, borderWidth: 2, borderColor: 'white', borderRadius: 10 },
});

export default QRScanner;