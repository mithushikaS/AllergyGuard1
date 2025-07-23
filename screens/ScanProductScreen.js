import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, Modal, Platform } from "react-native";
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
import { Camera } from 'expo-camera';
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

  if (!permission) {
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

  if (!permission.granted) {
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
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri);
    setScanning(true);
    try {
      setTimeout(() => {
        setImageCaptured('https://api.a0.dev/assets/image?text=Product+Label&aspect=4:3');
        setScanning(false);
        setTimeout(() => {
          analyzeImage();
        }, 500);
      }, 1000);
    } catch (error) {
      console.error('Error taking picture:', error);
      showErrorToast('Failed to capture image');
      setScanning(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
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
          options: ['Cancel', 'Take Photo', 'Choose from Library', 'Upload File'],
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 1:
              takePicture();
              break;
            case 2:
              pickImageFromLibrary();
              break;
            case 3:
              pickDocument();
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

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        
        if (fileInfo.exists) {
          setImageCaptured(fileUri);
          setScanning(false);
          setTimeout(() => {
            analyzeImage();
          }, 500);
        } else {
          throw new Error('File not found');
        }
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

      if (result.type === 'success') {
        const fileUri = result.uri;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        
        if (fileInfo.exists) {
          setImageCaptured(fileUri);
          setScanning(false);
          setTimeout(() => {
            analyzeImage();
          }, 500);
        } else {
          throw new Error('File not found');
        }
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
      setTimeout(() => {
        setImageCaptured('https://api.a0.dev/assets/image?text=Food+Product+Label&aspect=4:3');
        setScanning(false);
        setTimeout(() => {
          analyzeImage();
        }, 500);
      }, 1000);
    } catch (error) {
      console.error('Error using sample image:', error);
      showErrorToast('Failed to use sample image');
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
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />
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
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
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
          <Pressable onPress={toggleMode}>
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
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {scanning && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Scanning...</Text>
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
  controlsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
});