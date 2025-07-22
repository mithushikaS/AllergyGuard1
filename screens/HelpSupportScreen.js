import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function HelpSupportScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  
  const goBack = () => {
    navigation.goBack();
  };

  const handleSearch = () => {
    if (searchQuery) {
      Toast.show({
        type: 'info',
        text1: 'Searching',
        text2: `Searching for: ${searchQuery}`
      });
    }
  };

  const handleSubmitQuestion = () => {
    if (!messageText.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your question'
      });
      return;
    }
    
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Your question has been submitted'
    });
    setMessageText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <FontAwesome name="search" size={18} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help topics..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8e8e93"
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={16} color="#8e8e93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <FaqItem
            question="How do I add allergies to my profile?"
            answer="Go to Profile > Manage My Allergies. You can add new allergies by tapping the '+' button and selecting from common allergens or entering a custom one."
          />
          <FaqItem
            question="How does the product scanning work?"
            answer="AllergyGuard uses your camera to scan product labels. The app will detect ingredients and compare them with your allergy profile to determine if the product is safe for you."
          />
          <FaqItem
            question="What if a product isn't in your database?"
            answer="If we can't find a product, you can submit it for review by our team. We're constantly updating our database with new products."
          />
          <FaqItem
            question="How accurate is the allergy detection?"
            answer="Our system is highly accurate, but we always recommend double-checking labels yourself, especially for severe allergies. We're committed to continuous improvement of our detection algorithms."
          />
          <FaqItem
            question="Can I share my allergy profile with others?"
            answer="Currently, you cannot directly share your profile, but we're working on adding this feature in a future update. Stay tuned!"
          />
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionSubtitle}>
            Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
          </Text>
          <View style={styles.messageContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your question here..."
              value={messageText}
              onChangeText={setMessageText}
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor="#8e8e93"
            />
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmitQuestion}
            >
              <Text style={styles.submitButtonText}>Submit Question</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Support Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Support Options</Text>
          
          <TouchableOpacity style={styles.supportOption}>
            <View style={styles.supportIconContainer}>
              <FontAwesome name="envelope" size={18} color="#041c33ff" />
            </View>
            <View style={styles.supportTextContainer}>
              <Text style={styles.supportTitle}>Email Support</Text>
              <Text style={styles.supportDescription}>support@allergyguard.com</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#8e8e93" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportOption}>
            <View style={styles.supportIconContainer}>
              <FontAwesome name="phone" size={18} color="#041c33ff" />
            </View>
            <View style={styles.supportTextContainer}>
              <Text style={styles.supportTitle}>Call Us</Text>
              <Text style={styles.supportDescription}>+94 117 123 456</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#8e8e93" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.supportOption}
            onPress={() => navigation.navigate('ExpertHelp')}
          >
            <View style={styles.supportIconContainer}>
              <FontAwesome name="user-md" size={18} color="#041c33ff" />
            </View>
            <View style={styles.supportTextContainer}>
              <Text style={styles.supportTitle}>Expert Help</Text>
              <Text style={styles.supportDescription}>Chat with a health professional</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#8e8e93" />
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About AllergyGuard</Text>
          <View style={styles.appInfoContainer}>
            <Text style={styles.appInfoText}>Version 1.0.0</Text>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Licenses</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FaqItem({ question, answer }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity 
      style={styles.faqItem} 
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <FontAwesome 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={14} 
          color="#041c33ff" 
        />
      </View>
      {expanded && (
        <Text style={styles.faqAnswer}>{answer}</Text>
      )}
    </TouchableOpacity>
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
  searchContainer: {
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#041c33ff',
  },
  clearButton: {
    padding: 6,
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 16,
    lineHeight: 20,
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#041c33ff',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 12,
    lineHeight: 20,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 140,
    color: '#041c33ff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#041c33ff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#041c33ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  supportIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#041c33ff',
  },
  supportDescription: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  appInfoContainer: {
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 16,
  },
  linkButton: {
    paddingVertical: 10,
  },
  linkButtonText: {
    fontSize: 14,
    color: '#041c33ff',
    fontWeight: '500',
  },
});