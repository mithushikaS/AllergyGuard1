import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import Toast from 'react-native-toast-message';
import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from "./screens/HomeScreen"
import ProfileScreen from "./screens/ProfileScreen"
import ScanProductScreen from "./screens/ScanProductScreen"
import SearchProductScreen from "./screens/SearchProductScreen"
import ProductResultScreen from "./screens/ProductResultScreen"
import MyAllergiesScreen from "./screens/MyAllergiesScreen"
import ExpertHelpScreen from "./screens/ExpertHelpScreen"
import HelpSupportScreen from "./screens/HelpSupportScreen"
import ScanHistoryScreen from "./screens/ScanHistoryScreen"
import LoginScreen from "./screens/LoginScreen"
import SignupScreen from "./screens/SignupScreen"
import WelcomeScreen from "./screens/WelcomeScreen"
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen"
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from './contexts/AuthContext';

const AuthStackNavigator = createNativeStackNavigator();
const AppStackNavigator = createNativeStackNavigator();
const RootStackNavigator = createNativeStackNavigator();

function AuthStack() {
  return (
    <AuthStackNavigator.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}
    >
      <AuthStackNavigator.Screen 
        name="Welcome" 
        component={WelcomeScreen}
      />
      <AuthStackNavigator.Screen 
        name="Login" 
        component={LoginScreen}
      />
      <AuthStackNavigator.Screen 
        name="Signup" 
        component={SignupScreen}
      />
      <AuthStackNavigator.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
      />
    </AuthStackNavigator.Navigator>
  );
}

function AppStack() {
  return (
    <AppStackNavigator.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}
    >
      <AppStackNavigator.Screen name="Home" component={HomeScreen} />
      <AppStackNavigator.Screen name="Profile" component={ProfileScreen} />
      <AppStackNavigator.Screen name="ScanProduct" component={ScanProductScreen} />
      <AppStackNavigator.Screen name="SearchProduct" component={SearchProductScreen} />
      <AppStackNavigator.Screen name="ProductResult" component={ProductResultScreen} />
      <AppStackNavigator.Screen name="MyAllergies" component={MyAllergiesScreen} />
      <AppStackNavigator.Screen name="ExpertHelp" component={ExpertHelpScreen} />
      <AppStackNavigator.Screen name="HelpSupport" component={HelpSupportScreen} />
      <AppStackNavigator.Screen name="ScanHistory" component={ScanHistoryScreen} />
    </AppStackNavigator.Navigator>
  );
}

function RootNavigator() {
  const authContext = React.useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  return (
    <RootStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}
    >
      {isAuthenticated ? (
        <RootStackNavigator.Screen name="App" component={AppStack} />
      ) : (
        <RootStackNavigator.Screen name="Auth" component={AuthStack} />
      )}
    </RootStackNavigator.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // User is signed in
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.userType);
            setIsAuthenticated(true);
          }
        } else {
          // User is signed out
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authContext = {
    isAuthenticated,
    userRole,
    login: (role = 'user') => {
      setUserRole(role);
      setIsAuthenticated(true);
    },
    logout: async () => {
      try {
        await auth.signOut();
        setIsAuthenticated(false);
        setUserRole(null);
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={styles.container}>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <Toast />
        </AuthContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});