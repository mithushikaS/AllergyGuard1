import React, { useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
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

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset email sent!'
      });
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message
      });
    } finally {
      setIsSubmitting(false);
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
          <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
            <FontAwesome name="arrow-left" size={22} color="#6200EE" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=AllergySafe+Logo&aspect=1:1' }}
              style={styles.logo}
            />
            <Text style={styles.logoText}>AllergyGuard</Text>
          </View>

          <Text style={styles.titleText}>Reset Password</Text>
          <Text style={styles.subtitleText}>
            Enter your email address and we'll send you instructions to reset your password
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={20} color="#6200EE" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting && !isSuccess}
              />
            </View>

            {isSuccess ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <FontAwesome name="check" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>Email Sent</Text>
                <Text style={styles.successMessage}>
                  Please check your inbox for password reset instructions
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Instructions</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginText}>Log In</Text>
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
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
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
    color: '#6200EE',
  },
  titleText: {
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
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  form: {
    width: width * 0.85,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    marginBottom: 25,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: '#F9F9F9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6200EE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#A884E1',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  loginText: {
    fontSize: 15,
    color: '#6200EE',
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ForgotPasswordScreen;
