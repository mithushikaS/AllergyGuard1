import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { 
  Button, 
  Pressable, 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  Platform, 
  TextInput,
  TouchableOpacity,
  ActivityIndicator 
} from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';

export default function ScanProductScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const navigation = useNavigation();

  const [uri, setUri] = useState(null);
  const [mode, setMode] = useState("picture");
  const [facing, setFacing] = useState("back");
  const [recording, setRecording] = useState(false);

  const [scanning, setScanning] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  // State for title screen
  const [showTitleScreen, setShowTitleScreen] = useState(true);
  const [productTitle, setProductTitle] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'info',
          text1: 'Permission required',
          text2: 'We need access to your photos to upload images',
          position: 'bottom'
        });
      }
    })();
  }, []);

  const goBack = () => navigation.goBack();

  // ---- FLOW CONTROL ----
  const proceedToScan = () => {
    if (!productTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Product title required',
        text2: 'Please enter a product title to continue',
        position: 'bottom'
      });
      return;
    }
    setShowTitleScreen(false); // now show scan page
  };

  // ---- ANALYSIS ----
  const analyzeImage = (imageUri) => {
    setScanning(true);

    Toast.show({
      type: 'info',
      text1: 'Analyzing ingredients...',
      position: 'bottom'
    });

    setTimeout(() => {
      setScanning(false);
      // Clear the URI so camera view shows when returning
      setUri(null);
      setImageCaptured(null);
      
      navigation.navigate('ProductResult', {
        productName: productTitle, // use entered product title
        brand: 'Scanned Brand',
        ingredients: [
          'Wheat Flour', 
          'Sugar', 
          'Vegetable Oil', 
          'Eggs', 
          'Salt'
        ],
        allergensFound: ['Wheat (Gluten)', 'Eggs'],
        isSafe: false,
        image: imageUri,
        isManualEntry: false
      });
    }, 2000);
  };

  // ---- CAPTURE ----
  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) {
        setUri(photo.uri);
        setImageCaptured(photo.uri);
        analyzeImage(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      showErrorToast('Failed to capture image');
    }
  };

  const pickImageFromLibrary = async () => {
    setShowUploadOptions(false);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0].uri) {
        // Clear any existing URI before analyzing
        setUri(null);
        setImageCaptured(null);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      showErrorToast('Failed to select image');
    }
  };

  const pickDocument = async () => {
    setShowUploadOptions(false);
    try {
      let result = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      if (result.type === 'success') {
        analyzeImage(result.uri);
      }
    } catch (error) {
      showErrorToast('Failed to upload file');
    }
  };

  const useSampleImage = () => {
    const sampleImageUri = 'https://api.a0.dev/assets/image?text=Food+Product+Label&aspect=4:3';
    analyzeImage(sampleImageUri);
  };

  const showErrorToast = (msg) => {
    Toast.show({ type: 'error', text1: msg, position: 'bottom' });
  };

  // ---- UI RENDER ----
  const renderTitleScreen = () => (
    <SafeAreaView style={styles.titleContainer}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.titleHeader}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: "#000" }]}>Add Product</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.titleContent}>
        <MaterialIcons name="qr-code-scanner" size={80} color="#041c33" />
        <Text style={styles.mainTitle}>Enter Product Name</Text>
        <Text style={styles.subtitle}>
          Please provide a product name before scanning its label
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder="Enter product name"
          placeholderTextColor="#64748B"
          value={productTitle}
          onChangeText={setProductTitle}
        />

        <TouchableOpacity style={styles.startButton} onPress={proceedToScan}>
          <Text style={styles.startButtonText}>Proceed to Scan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderCamera = () => (
    <View style={{ flex: 1, width: "100%" }}>
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={mode}
        facing={facing}
      />
      
      {/* Back button in top left */}
      <TouchableOpacity 
        style={styles.backButtonCamera}
        onPress={goBack}
      >
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      
      {/* Upload button in top right */}
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={pickImageFromLibrary}
      >
        <Ionicons name="cloud-upload" size={32} color="white" />
      </TouchableOpacity>

      {/* Camera shutter button in bottom center */}
      <View style={styles.shutterContainer}>
        <Pressable onPress={takePicture}>
          <View style={styles.shutterBtn}>
            <View style={[styles.shutterBtnInner, { backgroundColor: "white" }]} />
          </View>
        </Pressable>
      </View>
    </View>
  );

  // ---- MAIN RETURN ----
  if (showTitleScreen) {
    return renderTitleScreen();
  }

  return (
    <View style={styles.container}>
      {scanning && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Analyzing...</Text>
        </View>
      )}
      {uri ? (
        <Image source={{ uri }} style={styles.previewImage} />
      ) : (
        renderCamera()
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#041c33" },
  titleContainer: { flex: 1, backgroundColor: "#fff" },
  titleHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  titleContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', marginVertical: 15 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 20 },
  textInput: {
    width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 12, fontSize: 16, marginBottom: 20
  },
  startButton: {
    backgroundColor: '#041c33', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10
  },
  startButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  camera: { flex: 1, width: "100%" },
  
  // Updated: Camera shutter button now centered at bottom
  shutterContainer: {
    position: "absolute", 
    bottom: 40, 
    left: 0,
    right: 0,
    alignItems: "center", // Center horizontally
  },
  shutterBtn: {
    borderWidth: 5, 
    borderColor: "white", 
    width: 85, 
    height: 85, 
    borderRadius: 45,
    alignItems: "center", 
    justifyContent: "center"
  },
  shutterBtnInner: { 
    width: 70, 
    height: 70, 
    borderRadius: 50 
  },
  
  // New: Upload button positioned in top right
  uploadButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  // New: Back button positioned in top left
  backButtonCamera: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  loadingText: { 
    color: 'white', 
    marginTop: 10, 
    fontSize: 18 
  },
  previewImage: { 
    flex: 1, 
    width: "100%" 
  }
});