import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

export default function ScanProductScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Simulate permission request
      setTimeout(() => {
        setHasPermission(true);
      }, 500);
    })();
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    setScanning(true);

    try {
      // Simulate taking a picture
      setTimeout(() => {
        setImageCaptured('https://api.a0.dev/assets/image?text=Product+Label&aspect=4:3');
        setScanning(false);
        setTimeout(() => {
          analyzeImage();
        }, 500);
      }, 1000);
    } catch (error) {
      console.error('Error taking picture:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to capture image',
        position: 'bottom'
      });
      setScanning(false);
    }
  };

  const pickImage = async () => {
    setScanning(true);

    try {
      setTimeout(() => {
        setImageCaptured('https://api.a0.dev/assets/image?text=Food+Product+Label&aspect=4:3');
        setScanning(false);
        setTimeout(() => {
          analyzeImage();
        }, 500);
      }, 1000);
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to select image',
        position: 'bottom'
      });
      setScanning(false);
    }
  };

  const analyzeImage = () => {
    setScanning(true);
    Toast.show({
      type: 'info',
      text1: 'Analyzing ingredients...',
      position: 'bottom'
    });

    setTimeout(() => {
      setScanning(false);
      navigation.navigate('ProductResult', {
        productName: 'Chocolate Chip Cookies',
        ingredients: [
          'Wheat Flour', 'Sugar', 'Chocolate Chips (Cocoa Mass, Sugar, Cocoa Butter, Emulsifier: Soy Lecithin)',
          'Vegetable Oil (Palm, Rapeseed)', 'Eggs', 'Salt', 'Raising Agent (Sodium Bicarbonate)'
        ],
        allergensFound: ['Wheat (Gluten)', 'Eggs', 'Soy'],
        isSafe: false,
        image: imageCaptured
      });
    }, 2000);
  };

  const resetCapture = () => {
    setImageCaptured(null);
    setScanning(false);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4C6EF5" />
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <FontAwesome name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Product</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.permissionDeniedContainer}>
          <FontAwesome name="camera-slash" size={60} color="#DC2626" />
          <Text style={styles.permissionDeniedText}>Camera permission denied</Text>
          <Text style={styles.permissionDeniedSubText}>
            AllergyGuard needs camera access to scan product labels
          </Text>
          <TouchableOpacity style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Enable Camera Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Product</Text>
        <View style={{ width: 24 }} />
      </View>

      {!imageCaptured ? (
        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            <FontAwesome name="camera" size={40} color="#ffffff" />
            <Text style={styles.cameraPlaceholderText}>Point camera at product label</Text>
          </View>

          <View style={styles.scanOverlay}>
            <View style={styles.scanCorner} />
            <View style={[styles.scanCorner, styles.topRight]} />
            <View style={[styles.scanCorner, styles.bottomLeft]} />
            <View style={[styles.scanCorner, styles.bottomRight]} />
          </View>

          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage} disabled={scanning}>
              <FontAwesome name="image" size={28} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cameraButton, styles.captureButton]} onPress={takePicture} disabled={scanning}>
              {scanning ? (
                <ActivityIndicator color="#ffffff" size="large" />
              ) : (
                <FontAwesome name="camera" size={28} color="#ffffff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate('SearchProduct')} disabled={scanning}>
              <FontAwesome name="search" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageCaptured }} style={styles.capturedImage} />
          {scanning ? (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.analyzingText}>Analyzing ingredients...</Text>
            </View>
          ) : (
            <View style={styles.imageControls}>
              <TouchableOpacity style={styles.imageButton} onPress={resetCapture}>
                <FontAwesome name="times" size={24} color="#ffffff" />
                <Text style={styles.imageButtonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={analyzeImage}>
                <FontAwesome name="check" size={24} color="#ffffff" />
                <Text style={styles.imageButtonText}>Analyze</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>How to scan:</Text>
        {['Point camera at the product\'s ingredients label', 'Hold steady until the scan completes', 'View the allergen analysis and safety information'].map((text, i) => (
          <View key={i} style={styles.instructionItem}>
            <View style={styles.instructionNumber}><Text style={styles.instructionNumberText}>{i + 1}</Text></View>
            <Text style={styles.instructionText}>{text}</Text>
          </View>
        ))}
      </View>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    backgroundColor: '#1E293B',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  backButton: { padding: 5 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#ffffff', marginTop: 20, fontSize: 18 },
  permissionDeniedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionDeniedText: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  permissionDeniedSubText: { color: '#cbd5e1', fontSize: 16, textAlign: 'center', marginTop: 10 },
  permissionButton: { backgroundColor: '#4C6EF5', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, marginTop: 20 },
  permissionButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  cameraContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cameraPlaceholder: { width: 300, height: 400, borderRadius: 15, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  cameraPlaceholderText: { color: '#94A3B8', marginTop: 15, fontSize: 16 },
  scanOverlay: { position: 'absolute', width: 300, height: 400 },
  scanCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4C6EF5',
    borderWidth: 3,
  },
  topRight: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0 },
  cameraControls: { flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginTop: 30 },
  cameraButton: {
    backgroundColor: '#334155',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  captureButton: {
    backgroundColor: '#4C6EF5',
    width: 80,
    height: 80,
  },
  imagePreviewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  capturedImage: { width: 300, height: 400, borderRadius: 15 },
  analyzingOverlay: {
    position: 'absolute',
    width: 300,
    height: 400,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  analyzingText: { color: '#ffffff', marginTop: 10, fontSize: 18 },
  imageControls: { flexDirection: 'row', marginTop: 20, width: '60%', justifyContent: 'space-around' },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  imageButtonText: { color: '#ffffff', fontSize: 16, marginLeft: 8 },
  instructions: { backgroundColor: '#1E293B', padding: 20 },
  instructionTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  instructionNumber: {
    backgroundColor: '#4C6EF5',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  instructionNumberText: { color: '#ffffff', fontWeight: 'bold' },
  instructionText: { color: '#cbd5e1', fontSize: 16, flex: 1 },
});