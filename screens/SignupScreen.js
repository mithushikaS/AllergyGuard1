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
import { registerUser } from '../services/authService';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from "firebase/auth";
import { signInWithGoogle } from '../services/googleAuthService';

const { width } = Dimensions.get('window');

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('user');
  const [specialization, setSpecialization] = useState('');

  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your full name'
      });
      return false;
    }

    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email address'
      });
      return false;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address'
      });
      return false;
    }

    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a password'
      });
      return false;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be at least 6 characters long'
      });
      return false;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match'
      });
      return false;
    }

    if (userType === 'expert' && !specialization.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your specialization'
      });
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Register user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: name
      });

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        userType,
        specialization: userType === 'expert' ? specialization.trim() : '',
        createdAt: new Date(),
        allergies: [],
        allergyQACompleted: false,
        emailVerified: false
      });

      // Send email verification
      try {
        await sendEmailVerification(user);
      } catch (emailError) {
        console.log('Email verification error:', emailError);
        // Continue even if email verification fails
      }

      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: userType === 'user' ? 'Please complete your allergy setup' : 'Welcome to AllergyGuard!'
      });

      // Auto-login the user
      login(userType);

      // Navigation will be handled automatically by the AppStack based on allergyQACompleted status

    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'An error occurred during signup';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }

      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!userType) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a role first'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'Google User',
        email: user.email,
        userType,
        specialization: userType === 'expert' ? '' : '',
        createdAt: new Date(),
        allergies: [],
        allergyQACompleted: false,
        emailVerified: user.emailVerified
      });

      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: 'Google signup successful!'
      });

      // Auto-login the user
      login(userType);

      // Navigation will be handled automatically by the AppStack based on allergyQACompleted status

    } catch (error) {
      console.error('Google signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: 'Google signup failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
              <FontAwesome name="arrow-left" size={20} color="#041c33ff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
          </View>

          <Text style={styles.welcomeText}>Get Started</Text>
          <Text style={styles.subtitleText}>
            {userType === 'expert'
              ? 'Create an expert account to help users with allergies'
              : 'Create an account to keep track of your allergies'}
          </Text>

          <View style={styles.form}>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'user' && styles.activeUserTypeButton,
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
                    userType === 'user' && styles.activeUserTypeText,
                  ]}
                >
                  User
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'expert' && styles.activeUserTypeButton,
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
                    userType === 'expert' && styles.activeUserTypeText,
                  ]}
                >
                  Expert
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={20} color="#041c33ff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
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
              />
            </View>

            {userType === 'expert' && (
              <View style={styles.inputContainer}>
                <FontAwesome name="stethoscope" size={20} color="#041c33ff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Specialization (e.g., Allergist)"
                  value={specialization}
                  onChangeText={setSpecialization}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#041c33ff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <FontAwesome
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color="#041c33ff"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#041c33ff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <FontAwesome
                  name={showConfirmPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color="#041c33ff"
                />
              </TouchableOpacity>
            </View>

            {userType === 'expert' && (
              <View style={styles.disclaimerContainer}>
                <FontAwesome
                  name="info-circle"
                  size={16}
                  color="#041c33ff"
                  style={styles.disclaimerIcon}
                />
                <Text style={styles.disclaimerText}>
                  By signing up as an expert, you agree to provide professional advice and your credentials may be verified.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separator} />
            </View>

            <TouchableOpacity 
              style={[styles.socialButton, isLoading && styles.buttonDisabled]} 
              onPress={handleGoogleSignup}
              disabled={isLoading}
            >
              <FontAwesome name="google" size={20} color="#DB4437" />
              <Text style={styles.socialButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginText}>Login</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#041c33ff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#333',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
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
    borderColor: '#041c33ff',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flex: 0.48,
    justifyContent: 'center',
  },
  activeUserTypeButton: {
    backgroundColor: '#041c33ff',
  },
  userTypeText: {
    marginLeft: 8,
    color: '#041c33ff',
  },
  activeUserTypeText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: '#333',
  },
  icon: {
    marginRight: 5,
    color: '#041c33ff',
  },
  eyeIcon: {
    padding: 5,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  disclaimerIcon: {
    marginRight: 8,
    marginTop: 2,
    color: '#041c33ff',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  button: {
    backgroundColor: '#041c33ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#AAA',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCC',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DB4437',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
  },
  socialButtonText: {
    marginLeft: 10,
    color: '#DB4437',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#333',
  },
  loginText: {
    color: '#041c33ff',
    fontWeight: 'bold',
  },
});

export default SignupScreen;