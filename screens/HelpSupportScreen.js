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
      // In a real app, this would search help articles
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
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <FontAwesome name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help topics..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#64748b"
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={16} color="#64748b" />
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
              placeholderTextColor="#999"
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
            <FontAwesome name="envelope" size={24} color="#4C6EF5" style={styles.supportIcon} />
            <View style={styles.supportTextContainer}>
              <Text style={styles.supportTitle}>Email Support</Text>
              <Text style={styles.supportDescription}>support@allergyguard.com</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportOption}>
            <FontAwesome name="phone" size={24} color="#4C6EF5" style={styles.supportIcon} />
            <View style={styles.supportTextContainer}>
              <Text style={styles.supportTitle}>Call Us</Text>
              <Text style={styles.supportDescription}>+94 117 123 456</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.supportOption}
            onPress={() => navigation.navigate('ExpertHelp')}
          >
            <FontAwesome name="user-md" size={24} color="#4C6EF5" style={styles.supportIcon} />
            <View style={styles.supportTextContainer}>
              <Text style={styles.supportTitle}>Expert Help</Text>
              <Text style={styles.supportDescription}>Chat with a health professional</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
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

// FAQ Item Component
function FaqItem({ question, answer }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity 
      style={styles.faqItem} 
      onPress={() => setExpanded(!expanded)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <FontAwesome 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#4C6EF5" 
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
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 16,
    color: '#0f172a',
  },
  clearButton: {
    padding: 6,
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageInput: {
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
    color: '#333',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#4C6EF5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  supportIcon: {
    marginRight: 15,
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  supportDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  appInfoContainer: {
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  linkButton: {
    paddingVertical: 10,
  },
  linkButtonText: {
    fontSize: 14,
    color: '#4C6EF5',
    fontWeight: '500',
  },
});

