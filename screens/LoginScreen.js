import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithGoogle } from '../services/googleAuthService';
import { setDoc } from 'firebase/firestore';
import { 
  registerUser, 
  loginUser, 
  resetPassword, 
  logoutUser,
  updateUserProfile,
  getUserProfile 
} from '../services/authService';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('user');
  
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const login = authContext?.login || (() => {});
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleLogin = async () => {
    // Basic validation
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email'
      });
      return;
    }
    
    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email'
      });
      return;
    }
    
    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your password'
      });
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Step 1: Login with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Step 2: Fetch user data from Firestore
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'User data not found'
        });
        return;
      }

      const userData = userSnap.data();

      // Step 3: Compare selected role with stored userType
      if (userData.userType !== userType) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `You are registered as a "${userData.userType}", not a "${userType}"`
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${userType === 'expert' ? 'Expert' : 'User'} login successful!`
      });
      login(userData.userType); // Call context or navigation logic here

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email.trim() || !password || !userType) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields including selecting a role'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Register user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Store user type in Firestore
      await setDoc(doc(db, 'users', uid), {
        email,
        userType, // 'user' or 'expert'
        createdAt: new Date()
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Signup successful!'
      });
      // Optionally, navigate or log in automatically
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
          </View>
          
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subtitleText}>Login to continue checking products safely</Text>
          
          <View style={styles.form}>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'user' && styles.activeUserTypeButton
                ]}
                onPress={() => setUserType('user')}
              >
                <FontAwesome 
                  name="user" 
                  size={18} 
                  color={userType === 'user' ? '#FFFFFF' : '#041c33ff'} 
                />
                <Text 
                  style={[
                    styles.userTypeText,
                    userType === 'user' && styles.activeUserTypeText
                  ]}
                >
                  User
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'expert' && styles.activeUserTypeButton
                ]}
                onPress={() => setUserType('expert')}
              >
                <FontAwesome 
                  name="user-md" 
                  size={18} 
                  color={userType === 'expert' ? '#FFFFFF' : '#041c33ff'} 
                />
                <Text 
                  style={[
                    styles.userTypeText,
                    userType === 'expert' && styles.activeUserTypeText
                  ]}
                >
                  Expert
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={20} color="#041c33ff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#041c33ff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)} 
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <FontAwesome
                  name={showPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="#041c33ff"
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={navigateToForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Logging in...' : userType === 'expert' ? 'Login as Expert' : 'Login'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separator} />
            </View>
            
            <TouchableOpacity 
              style={styles.socialButton}
              disabled={isLoading}
            >
              <FontAwesome name="google" size={20} color="#DB4437" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity 
              onPress={navigateToSignup}
              disabled={isLoading}
            >
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#041c33ff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    color: '#333',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 30,
  },
  form: {
    width: width * 0.85,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#041c33ff',
  },
  activeUserTypeButton: {
    backgroundColor: '#041c33ff',
  },
  userTypeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#041c33ff',
  },
  activeUserTypeText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: '#F9F9F9',
  },
  icon: {
    marginRight: 10,
    color: '#041c33ff',
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#041c33ff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#041c33ff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#1a3a5a',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  signupText: {
    fontSize: 15,
    color: '#041c33ff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;