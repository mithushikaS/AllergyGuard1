// screens/ExpertChatScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView, // Add this import
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#041c33ff',
  white: '#FFFFFF',
  lightGray: '#f8f9fa',
  darkGray: '#64748b',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  accent: '#3B82F6',
};

// Mock chat messages
const MOCK_MESSAGES = [
  {
    id: '1',
    text: 'Hello Doctor, I have a question about wheat allergy.',
    sender: 'patient',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: '2',
    text: 'Hello! I\'m here to help. Could you tell me more about your symptoms?',
    sender: 'expert',
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
  },
  {
    id: '3',
    text: 'I get stomach pain and rash after eating products with wheat.',
    sender: 'patient',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
  },
  {
    id: '4',
    text: 'Those are common symptoms. Have you been officially diagnosed with wheat allergy?',
    sender: 'expert',
    timestamp: new Date(Date.now() - 1000 * 60 * 7),
  },
];

export default function ExpertChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { consultation } = route.params || {};
  
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');

  const goBack = () => navigation.goBack();

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'expert',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Simulate patient response after 2 seconds
    setTimeout(() => {
      const patientResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your advice. I will schedule an appointment with my doctor.',
        sender: 'patient',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, patientResponse]);
    }, 2000);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'expert' ? styles.expertMessage : styles.patientMessage
    ]}>
      {item.sender === 'patient' && (
        <Image 
          source={{ uri: consultation?.userAvatar || 'https://api.a0.dev/assets/image?text=user&aspect=1:1' }} 
          style={styles.avatar} 
        />
      )}
      
      <View style={[
        styles.messageBubble,
        item.sender === 'expert' ? styles.expertBubble : styles.patientBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {item.sender === 'expert' && (
        <Image 
          source={{ uri: 'https://api.a0.dev/assets/image?text=doctor&aspect=1:1' }} 
          style={styles.avatar} 
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Image 
            source={{ uri: consultation?.userAvatar || 'https://api.a0.dev/assets/image?text=user&aspect=1:1' }} 
            style={styles.headerAvatar} 
          />
          <View>
            <Text style={styles.headerName}>
              {consultation?.userName || 'Patient'}
            </Text>
            <Text style={styles.headerStatus}>Active now</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your response..."
            placeholderTextColor={COLORS.darkGray}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxHeight={100}
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <MaterialIcons 
              name="send" 
              size={24} 
              color={newMessage.trim() ? COLORS.white : COLORS.darkGray} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Quick Responses */}
      <View style={styles.quickResponses}>
        <Text style={styles.quickResponsesTitle}>Quick Responses</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.quickResponseContainer}>
            {[
              'Please describe your symptoms in detail',
              'Have you consulted a doctor about this?',
              'When did the symptoms first appear?',
              'Are you taking any medications?'
            ].map((response, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickResponseButton}
                onPress={() => setNewMessage(response)}
              >
                <Text style={styles.quickResponseText}>{response}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  headerStatus: {
    fontSize: 12,
    color: '#E2E8F0',
  },
  moreButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  expertMessage: {
    justifyContent: 'flex-end',
  },
  patientMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  expertBubble: {
    backgroundColor: '#D2DFEB',
    borderBottomRightRadius: 4,
  },
  patientBubble: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.primary,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.darkGray,
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.primary,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  quickResponses: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 16,
  },
  quickResponsesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  quickResponseContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  quickResponseButton: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quickResponseText: {
    fontSize: 12,
    color: COLORS.primary,
  },
});