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
      const uid = result.user.uid;

      // Store user type in Firestore
      await setDoc(doc(db, 'users', uid), {
        email: result.user.email,
        userType,
        createdAt: new Date()
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Google signup successful!'
      });
      // Navigate to appropriate screen
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
              <FontAwesome name="arrow-left" size={20} color="#6200EE" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')} // Adjust path if needed
              style={styles.logo}
            />
            <Text style={styles.logoText}>AllergyGuard</Text>
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
                  color={userType === 'user' ? '#FFFFFF' : '#6200EE'}
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
                  color={userType === 'expert' ? '#FFFFFF' : '#6200EE'}
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
              <FontAwesome name="user" size={20} color="#6200EE" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={20} color="#6200EE" style={styles.icon} />
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
                <FontAwesome name="stethoscope" size={20} color="#6200EE" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Specialization (e.g., Allergist)"
                  value={specialization}
                  onChangeText={setSpecialization}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#6200EE" style={styles.icon} />
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
                  color="#6200EE"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#6200EE" style={styles.icon} />
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
                  color="#6200EE"
                />
              </TouchableOpacity>
            </View>

            {userType === 'expert' && (
              <View style={styles.disclaimerContainer}>
                <FontAwesome
                  name="info-circle"
                  size={16}
                  color="#6200EE"
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

            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignup}>
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
    color: '#6200EE',
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
    borderColor: '#6200EE',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flex: 0.48,
    justifyContent: 'center',
  },
  activeUserTypeButton: {
    backgroundColor: '#6200EE',
  },
  userTypeText: {
    marginLeft: 8,
    color: '#6200EE',
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
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  button: {
    backgroundColor: '#6200EE',
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
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
