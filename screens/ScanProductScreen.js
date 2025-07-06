import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {useEffect } from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

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
          <TouchableOpacity style={styles.permissionButton}>
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
  const goBack = () => {
    navigation.goBack();
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
      {uri ? renderPicture() : renderCamera()}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    cameraButton: {
    backgroundColor: '#334155',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
});