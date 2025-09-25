import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, Modal, Platform, TextInput } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect } from 'react';
import { TouchableOpacity, ActivityIndicator, ActionSheetIOS } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import * as FileSystem from 'expo-file-system';

export default function ScanProductScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [uri, setUri] = useState(null);
  const [mode, setMode] = useState("picture");
  const [facing, setFacing] = useState("back");
  const [recording, setRecording] = useState(false);
  const navigation = useNavigation();
  const [scanning, setScanning] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  
  // New state for controlling the title screen
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

  const goBack = () => {
    navigation.goBack();
  };

  const startScanning = () => {
    setShowTitleScreen(false);
  };

  const analyzeManualProduct = () => {
    if (!productTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Product title required',
        text2: 'Please enter a product title to continue',
        position: 'bottom'
      });
      return;
    }

    setScanning(true);
    
    Toast.show({
      type: 'info',
      text1: 'Analyzing product...',
      text2: `Searching for "${productTitle}"`,
      position: 'bottom'
    });

    // Simulate API call for manual product search
    setTimeout(() => {
      setScanning(false);
      
      navigation.navigate('ProductResult', {
        productName: productTitle,
        brand: 'Generic Brand',
        ingredients: [
          'Wheat Flour', 
          'Sugar', 
          'Vegetable Oil', 
          'Salt', 
          'Baking Powder',
          'Natural Flavoring'
        ],
        allergensFound: ['Wheat (Gluten)'],
        isSafe: false,
        image: null, // No image for manual entry
        isManualEntry: true
      });
    }, 2000);
  };

  // Title Screen Component
  const renderTitleScreen = () => {
    return (
      <SafeAreaView style={styles.titleContainer}>
        <StatusBar style="light" />
        
        {/* Header */}
        <View style={styles.titleHeader}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <FontAwesome name="arrow-left" size={24} color="#000000ff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Product</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <View style={styles.titleContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="qr-code-scanner" size={80} color="#041c33ff" />
          </View>

          {/* Title and Description */}
          <Text style={styles.mainTitle}>Add Product</Text>
          <Text style={styles.subtitle}>
            Enter product name manually or scan the product label to check for allergens
          </Text>

          {/* Manual Product Title Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Product Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter product name (e.g., Chocolate Chip Cookies)"
              placeholderTextColor="#64748B"
              value={productTitle}
              onChangeText={setProductTitle}
              maxLength={100}
            />
          </View>

          
          {/* Start Button */}
          <TouchableOpacity style={styles.startButton} onPress={startScanning}>
            <Text style={styles.startButtonText}>Scan Product Label</Text>
            <MaterialIcons name="qr-code-scanner" size={24} color="white" />
          </TouchableOpacity>

          {/* Upload Options */}
          <TouchableOpacity 
            style={styles.uploadOptionsButton} 
            onPress={showUploadActionSheet}
          >
            <Ionicons name="cloud-upload" size={20} color="#1E3A8A" />
            <Text style={styles.uploadOptionsText}>Or upload from gallery</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  if (!permission && !showTitleScreen) {
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
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Enable Camera Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission?.granted && !showTitleScreen) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) {
        setUri(photo.uri);
        setImageCaptured(photo.uri);
        setScanning(true);
        
        setTimeout(() => {
          setScanning(false);
          analyzeImage(photo.uri);
        }, 1000);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      showErrorToast('Failed to capture image');
      setScanning(false);
    }
  };

  const showErrorToast = (message) => {
    Toast.show({
      type: 'error',
      text1: message,
      position: 'bottom'
    });
  };

  const showUploadActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library', 'Upload File', 'Use Sample Image'],
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 1:
              if (showTitleScreen) {
                setShowTitleScreen(false);
                setTimeout(() => takePicture(), 100);
              } else {
                takePicture();
              }
              break;
            case 2:
              pickImageFromLibrary();
              break;
            case 3:
              pickDocument();
              break;
            case 4:
              useSampleImage();
              break;
          }
        }
      );
    } else {
      setShowUploadOptions(true);
    }
  };

  const pickImageFromLibrary = async () => {
    setShowUploadOptions(false);
    setScanning(true);
    
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0].uri) {
        const fileUri = result.assets[0].uri;
        setImageCaptured(fileUri);
        setScanning(false);
        setTimeout(() => {
          analyzeImage(fileUri);
        }, 500);
      } else {
        setScanning(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showErrorToast('Failed to select image');
      setScanning(false);
    }
  };

  const pickDocument = async () => {
    setShowUploadOptions(false);
    setScanning(true);
    
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success' && result.uri) {
        const fileUri = result.uri;
        setImageCaptured(fileUri);
        setScanning(false);
        setTimeout(() => {
          analyzeImage(fileUri);
        }, 500);
      } else {
        setScanning(false);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      showErrorToast('Failed to upload file');
      setScanning(false);
    }
  };

  const useSampleImage = () => {
    setShowUploadOptions(false);
    setScanning(true);
    
    try {
      const sampleImageUri = 'https://api.a0.dev/assets/image?text=Food+Product+Label&aspect=4:3';
      setImageCaptured(sampleImageUri);
      
      setTimeout(() => {
        setScanning(false);
        analyzeImage(sampleImageUri);
      }, 1000);
    } catch (error) {
      console.error('Error using sample image:', error);
      showErrorToast('Failed to use sample image');
      setScanning(false);
    }
  };

  const analyzeImage = (imageUri) => {
    setScanning(true);
    
    console.log('Analyzing image with URI:', imageUri);
    
    Toast.show({
      type: 'info',
      text1: 'Analyzing ingredients...',
      position: 'bottom'
    });

    setTimeout(() => {
      setScanning(false);
      
      navigation.navigate('ProductResult', {
        productName: 'Chocolate Chip Cookies',
        brand: 'Sweet Delights',
        ingredients: [
          'Wheat Flour', 
          'Sugar', 
          'Chocolate Chips (Cocoa Mass, Sugar, Cocoa Butter, Emulsifier: Soy Lecithin)',
          'Vegetable Oil (Palm, Rapeseed)', 
          'Eggs', 
          'Salt', 
          'Raising Agent (Sodium Bicarbonate)'
        ],
        allergensFound: ['Wheat (Gluten)', 'Eggs', 'Soy'],
        isSafe: false,
        image: imageUri
      });
    }, 2000);
  };

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await ref.current?.recordAsync();
    console.log({ video });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderPicture = () => {
    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={styles.previewImage}
        />
        <View style={styles.previewButtons}>
          <TouchableOpacity style={styles.retryButton} onPress={() => setUri(null)}>
            <Text style={styles.retryButtonText}>Retake Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.analyzeButton} onPress={() => analyzeImage(uri)}>
            <Text style={styles.analyzeButtonText}>Analyze This Image</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={{ flex: 1, width: "100%" }}>
        <CameraView
          style={styles.camera}
          ref={ref}
          mode={mode}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        />
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowTitleScreen(true)}>
            <FontAwesome name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={showUploadActionSheet}
          >
            <Ionicons name="cloud-upload" size={28} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.shutterContainer}>
          <Pressable onPress={toggleMode} style={styles.modeButton}>
            {mode === "picture" ? (
              <AntDesign name="picture" size={32} color="white" />
            ) : (
              <Feather name="video" size={32} color="white" />
            )}
          </Pressable>
          
          <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: mode === "picture" ? "white" : "red",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          
          <Pressable onPress={toggleFacing} style={styles.flipButton}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  // Show title screen first
  if (showTitleScreen) {
    return (
      <View style={styles.container}>
        {scanning && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Scanning Product...</Text>
          </View>
        )}
        
        {renderTitleScreen()}
        
        {/* Android Upload Options Modal */}
        {Platform.OS === 'android' && (
          <Modal
            visible={showUploadOptions}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowUploadOptions(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Upload Options</Text>
                
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={() => {
                    setShowTitleScreen(false);
                    setTimeout(() => takePicture(), 100);
                  }}
                >
                  <Ionicons name="camera" size={24} color="#1E3A8A" />
                  <Text style={styles.optionText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={pickImageFromLibrary}
                >
                  <MaterialIcons name="photo-library" size={24} color="#1E3A8A" />
                  <Text style={styles.optionText}>Choose from Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={pickDocument}
                >
                  <MaterialIcons name="insert-drive-file" size={24} color="#1E3A8A" />
                  <Text style={styles.optionText}>Upload File</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={useSampleImage}
                >
                  <MaterialIcons name="collections" size={24} color="#1E3A8A" />
                  <Text style={styles.optionText}>Use Sample Image</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowUploadOptions(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        
        <Toast />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scanning && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Scanning Product...</Text>
        </View>
      )}
      
      {uri ? renderPicture() : renderCamera()}
      
      {/* Android Upload Options Modal */}
      {Platform.OS === 'android' && (
        <Modal
          visible={showUploadOptions}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUploadOptions(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Upload Options</Text>
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={takePicture}
              >
                <Ionicons name="camera" size={24} color="#1E3A8A" />
                <Text style={styles.optionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={pickImageFromLibrary}
              >
                <MaterialIcons name="photo-library" size={24} color="#1E3A8A" />
                <Text style={styles.optionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={pickDocument}
              >
                <MaterialIcons name="insert-drive-file" size={24} color="#1E3A8A" />
                <Text style={styles.optionText}>Upload File</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={useSampleImage}
              >
                <MaterialIcons name="collections" size={24} color="#1E3A8A" />
                <Text style={styles.optionText}>Use Sample Image</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowUploadOptions(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041c33",
    alignItems: "center",
    justifyContent: "center",
  },
  // Title Screen Styles
  titleContainer: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  titleContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    backgroundColor: 'rgba(97, 97, 100, 0.1)',
    padding: 30,
    borderRadius: 50,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#041c33ff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  // Input Section Styles
  inputSection: {
    width: '100%',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 15,
  },
  analyzeButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    gap: 10,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#041c33ff',
    opacity: 0.6,
  },
  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  featuresList: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 15,
    flex: 1,
  },
  startButton: {
    backgroundColor: '#041c33ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  uploadOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E3A8A',
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
  },
  uploadOptionsText: {
    color: '#1E3A8A',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  // Existing styles continue...
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  modeButton: {
    padding: 10,
  },
  flipButton: {
    padding: 10,
  },
  controlsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 50,
  },
  uploadButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 50,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,28,51,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E3A8A',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1E3A8A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionDeniedText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionDeniedSubText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#041c33',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 30,
  },
  previewButtons: {
    width: '100%',
    gap: 15,
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#041c33ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});