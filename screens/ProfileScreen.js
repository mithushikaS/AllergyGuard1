import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useState, useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { userRole, logout } = useContext(AuthContext);
  const isExpert = userRole === 'expert';
  
  // Regular user state
  const [name, setName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [languagePreference, setLanguagePreference] = useState('English');

  // Expert-specific state
  const [specialization, setSpecialization] = useState('Allergist');
  const [experience, setExperience] = useState('');
  const [hospital, setHospital] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  
  const languages = ['English', 'Sinhala', 'Tamil'];
  const specializations = ['Allergist', 'Nutritionist', 'Dermatologist', 'Immunologist', 'Pharmacist'];
  
  const goBack = () => {
    navigation.goBack();
  };

  const saveProfile = () => {
    // Save profile logic would go here
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Profile updated successfully'
    });
  };

  const handleLogout = () => {
    logout();
    // The logout function in AuthContext will handle the navigation state change
    // No need to manually navigate as the RootNavigator will handle it based on isAuthenticated
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isExpert ? 'Expert Profile' : 'My Profile'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileImageSection}>
          <Image
            source={{ 
              uri: isExpert 
                ? 'https://api.a0.dev/assets/image?text=expert+profile&aspect=1:1' 
                : 'https://api.a0.dev/assets/image?text=user+profile&aspect=1:1' 
            }}
            style={[
              styles.profileImage,
              isExpert && styles.expertProfileImage
            ]}
          />
          <TouchableOpacity style={styles.editProfileButton}>
            <FontAwesome name="camera" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {isExpert ? (
          // Expert Profile Content
          <>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Professional Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Specialization</Text>
                <View style={styles.specializationOptions}>
                  {specializations.map(spec => (
                    <TouchableOpacity 
                      key={spec}
                      style={[
                        styles.specializationOption,
                        specialization === spec && styles.selectedSpecializationOption
                      ]}
                      onPress={() => setSpecialization(spec)}
                    >
                      <Text 
                        style={[
                          styles.specializationText,
                          specialization === spec && styles.selectedSpecializationText
                        ]}
                      >
                        {spec}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Years of Experience</Text>
                <TextInput
                  style={styles.input}
                  value={experience}
                  onChangeText={setExperience}
                  placeholder="Years of professional experience"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hospital/Clinic</Text>
                <TextInput
                  style={styles.input}
                  value={hospital}
                  onChangeText={setHospital}
                  placeholder="Your hospital or clinic name"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={styles.verificationBadge}>
                <FontAwesome name="check-circle" size={20} color="#10b981" />
                <Text style={styles.verificationText}>Verified Professional</Text>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Consultation Settings</Text>
              
              <View style={styles.switchGroup}>
                <View style={styles.switchTextGroup}>
                  <Text style={styles.switchLabel}>Available for Consultations</Text>
                  <Text style={styles.switchDescription}>Toggle off when you're not available to respond</Text>
                </View>
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  trackColor={{ false: "#e0e0e0", true: "#4C6EF5" }}
                  thumbColor="#ffffff"
                />
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchTextGroup}>
                  <Text style={styles.switchLabel}>Consultation Notifications</Text>
                  <Text style={styles.switchDescription}>Get alerts for new consultation requests</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#e0e0e0", true: "#4C6EF5" }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Performance Metrics</Text>
              
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>98%</Text>
                  <Text style={styles.metricLabel}>Response Rate</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>4.9</Text>
                  <Text style={styles.metricLabel}>Rating</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>152</Text>
                  <Text style={styles.metricLabel}>Consultations</Text>
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              
              <View style={styles.preferenceGroup}>
                <Text style={styles.preferenceLabel}>Language</Text>
                <View style={styles.languageOptions}>
                  {languages.map(lang => (
                    <TouchableOpacity 
                      key={lang}
                      style={[
                        styles.languageOption,
                        languagePreference === lang && styles.selectedLanguageOption
                      ]}
                      onPress={() => setLanguagePreference(lang)}
                    >
                      <Text 
                        style={[
                          styles.languageText,
                          languagePreference === lang && styles.selectedLanguageText
                        ]}
                      >
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </>
        ) : (
          // Regular User Profile Content
          <>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Emergency Contact</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  placeholder="Emergency contact number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.switchGroup}>
                <View style={styles.switchTextGroup}>
                  <Text style={styles.switchLabel}>Enable Notifications</Text>
                  <Text style={styles.switchDescription}>Get alerts about potentially harmful products</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#e0e0e0", true: "#4C6EF5" }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              
              <View style={styles.preferenceGroup}>
                <Text style={styles.preferenceLabel}>Language</Text>
                <View style={styles.languageOptions}>
                  {languages.map(lang => (
                    <TouchableOpacity 
                      key={lang}
                      style={[
                        styles.languageOption,
                        languagePreference === lang && styles.selectedLanguageOption
                      ]}
                      onPress={() => setLanguagePreference(lang)}
                    >
                      <Text 
                        style={[
                          styles.languageText,
                          languagePreference === lang && styles.selectedLanguageText
                        ]}
                      >
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('MyAllergies')}
            >
              <View style={styles.actionButtonContent}>
                <FontAwesome name="exclamation-circle" size={24} color="#4C6EF5" />
                <Text style={styles.actionButtonText}>Manage My Allergies</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('ScanHistory')}
            >
              <View style={styles.actionButtonContent}>
                <FontAwesome name="history" size={24} color="#4C6EF5" />
                <Text style={styles.actionButtonText}>Scan History</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('HelpSupport')}
            >
              <View style={styles.actionButtonContent}>
                <FontAwesome name="question-circle" size={24} color="#4C6EF5" />
                <Text style={styles.actionButtonText}>Help & Support</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={24} color="#DC2626" />
          <Text style={styles.dangerButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    backgroundColor: '#4C6EF5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  expertProfileImage: {
    borderColor: '#10b981',
    borderWidth: 4,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#4C6EF5',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchTextGroup: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: '#777',
  },
  preferenceGroup: {
    marginBottom: 20,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f7',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedLanguageOption: {
    backgroundColor: '#4C6EF5',
  },
  languageText: {
    color: '#555',
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: '#ffffff',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 30,
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '500',
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: '#4C6EF5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    margin: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Expert-specific styles
  specializationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specializationOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f7',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSpecializationOption: {
    backgroundColor: '#10b981',
  },
  specializationText: {
    color: '#555',
    fontWeight: '500',
  },
  selectedSpecializationText: {
    color: '#ffffff',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  verificationText: {
    color: '#10b981',
    fontWeight: '500',
    marginLeft: 6,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C6EF5',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
});