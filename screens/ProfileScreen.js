import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useState, useContext, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { userRole, logout, user } = useContext(AuthContext);
  const isExpert = userRole === 'expert';
  
  // Regular user state with initial values from user context
  const [name, setName] = useState(user?.name || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [languagePreference, setLanguagePreference] = useState('English');

  // Expert-specific state
  const [specialization, setSpecialization] = useState('Allergist');
  const [experience, setExperience] = useState('');
  const [hospital, setHospital] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  
  const languages = ['English', 'Sinhala', 'Tamil'];
  const specializations = ['Allergist', 'Nutritionist', 'Dermatologist', 'Immunologist', 'Pharmacist'];
  
  // Set initial values when component mounts
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmergencyContact(user.emergencyContact || '');
      // Set other user-specific fields as needed
    }
  }, [user]);

  const goBack = () => {
    navigation.goBack();
  };

  const saveProfile = () => {
    // Here you would typically save to your backend/database
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Profile updated successfully'
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isExpert ? 'Expert Profile' : 'My Profile'}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ 
                uri: isExpert 
                  ? 'https://api.a0.dev/assets/image?text=expert+profile&aspect=1:1' 
                  : 'https://api.a0.dev/assets/image?text=user+profile&aspect=1:1' 
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editProfileButton}>
              <FontAwesome name="camera" size={14} color="#041c33ff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{name || (isExpert ? 'Dr. John Doe' : 'Alex Johnson')}</Text>
          {isExpert && (
            <View style={styles.expertBadge}>
              <Text style={styles.expertBadgeText}>Verified Expert</Text>
              <FontAwesome name="check-circle" size={14} color="#fff" />
            </View>
          )}
        </View>

        {isExpert ? (
          // Expert Profile Content
          <>
            {/* Professional Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#8e8e93"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Specialization</Text>
                <View style={styles.tagContainer}>
                  {specializations.map(spec => (
                    <TouchableOpacity 
                      key={spec}
                      style={[
                        styles.tag,
                        specialization === spec && styles.tagActive
                      ]}
                      onPress={() => setSpecialization(spec)}
                    >
                      <Text style={[
                        styles.tagText,
                        specialization === spec && styles.tagTextActive
                      ]}>
                        {spec}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Years of Experience</Text>
                <TextInput
                  style={styles.input}
                  value={experience}
                  onChangeText={setExperience}
                  placeholder="Years of professional experience"
                  placeholderTextColor="#8e8e93"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Hospital/Clinic</Text>
                <TextInput
                  style={styles.input}
                  value={hospital}
                  onChangeText={setHospital}
                  placeholder="Your hospital or clinic name"
                  placeholderTextColor="#8e8e93"
                />
              </View>
            </View>

            {/* Availability Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Availability</Text>
              
              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Available for Consultations</Text>
                  <Text style={styles.switchSubtext}>Toggle off when you're not available</Text>
                </View>
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  trackColor={{ false: "#767577", true: "#0a84ff" }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Notifications</Text>
                  <Text style={styles.switchSubtext}>Get alerts for new requests</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#767577", true: "#0a84ff" }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </>
        ) : (
          // Regular User Profile Content
          <>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#8e8e93"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Emergency Contact</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  placeholder="Emergency contact number"
                  placeholderTextColor="#8e8e93"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Notifications</Text>
                  <Text style={styles.switchSubtext}>Get alerts about harmful products</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#767577", true: "#0a84ff" }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('MyAllergies')}
              >
                <View style={styles.actionButtonIcon}>
                  <FontAwesome name="exclamation-circle" size={20} color="#041c33ff" />
                </View>
                <Text style={styles.actionButtonText}>Manage My Allergies</Text>
                <FontAwesome name="chevron-right" size={14} color="#8e8e93" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('ScanHistory')}
              >
                <View style={styles.actionButtonIcon}>
                  <FontAwesome name="history" size={20} color="#041c33ff" />
                </View>
                <Text style={styles.actionButtonText}>Scan History</Text>
                <FontAwesome name="chevron-right" size={14} color="#8e8e93" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('HelpSupport')}
              >
                <View style={styles.actionButtonIcon}>
                  <FontAwesome name="question-circle" size={20} color="#041c33ff" />
                </View>
                <Text style={styles.actionButtonText}>Help & Support</Text>
                <FontAwesome name="chevron-right" size={14} color="#8e8e93" />
              </TouchableOpacity>
            </View>
          </>
        )}
        
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Language</Text>
            <View style={styles.tagContainer}>
              {languages.map(lang => (
                <TouchableOpacity 
                  key={lang}
                  style={[
                    styles.tag,
                    languagePreference === lang && styles.tagActive
                  ]}
                  onPress={() => setLanguagePreference(lang)}
                >
                  <Text style={[
                    styles.tagText,
                    languagePreference === lang && styles.tagTextActive
                  ]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#041c33ff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#041c33ff',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#041c33ff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#041c33ff',
    marginBottom: 8,
  },
  expertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#041c33ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  expertBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#041c33ff',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#041c33ff',
    marginBottom: 8,
    opacity: 0.8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#041c33ff', // Changed to blue color
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tagActive: {
    backgroundColor: '#041c33ff',
    borderColor: '#041c33ff',
  },
  tagText: {
    color: '#041c33ff',
    fontSize: 14,
    fontWeight: '500',
  },
  tagTextActive: {
    color: '#ffffff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  switchLabel: {
    fontSize: 16,
    color: '#041c33ff',
    fontWeight: '500',
  },
  switchSubtext: {
    fontSize: 13,
    color: '#8e8e93',
    marginTop: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#041c33ff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    color: '#8e8e93',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  actionButtonIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#041c33ff',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#041c33ff',
  },
  logoutButtonText: {
    color: '#041c33ff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#041c33ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    margin: 16,
    shadowColor: '#041c33ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});