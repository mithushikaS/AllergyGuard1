import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { db } from '../firebaseConfig';
import firebase from 'firebase/compat/app';

const EXPERTS = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    role: 'Allergist / Immunologist',
    specialty: 'Food allergies, anaphylaxis',
    rating: 4.9,
    reviews: 124,
    available: true,
    avatar: 'https://api.a0.dev/assets/image?text=doctor+profile+1&aspect=1:1',
  },
  {
    id: '2',
    name: 'Chamara Perera',
    role: 'Pharmacist',
    specialty: 'Drug allergies, medication guidance',
    rating: 4.7,
    reviews: 98,
    available: true,
    avatar: 'https://api.a0.dev/assets/image?text=pharmacist+profile&aspect=1:1',
  },
  {
    id: '3',
    name: 'Dr. Asanka Fernando',
    role: 'Dermatologist',
    specialty: 'Skin reactions to allergens',
    rating: 4.8,
    reviews: 113,
    available: false,
    avatar: 'https://api.a0.dev/assets/image?text=doctor+profile+2&aspect=1:1',
  },
];

export default function ExpertHelpScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const goBack = () => navigation.goBack();

  const filteredExperts = EXPERTS.filter(expert =>
    expert.name.toLowerCase().includes(query.toLowerCase()) ||
    expert.role.toLowerCase().includes(query.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(query.toLowerCase())
  );

  const startChat = async (expert) => {
    setSelectedExpert(expert);
    setShowChat(true);

    const snapshot = await db.collection('chats')
      .where('expertId', '==', expert.id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      await db.collection('chats').add({
        sender: 'expert',
        expertId: expert.id,
        message: `Hello, I'm ${expert.name}. How can I help you with your allergy concerns today?`,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedExpert) return;

    try {
      await db.collection('chats').add({
        sender: 'user',
        expertId: selectedExpert.id,
        message: message.trim(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setMessage('');

      setTimeout(async () => {
        let expertResponse;
        const lower = message.toLowerCase();
        if (lower.includes('allergic')) {
          expertResponse = "Can you tell me more about your symptoms and triggers?";
        } else if (lower.includes('ingredients') || lower.includes('product')) {
          expertResponse = "Would you like me to provide common hidden names for allergens?";
        } else if (lower.includes('reaction') || lower.includes('symptoms')) {
          expertResponse = "If symptoms are severe like swelling or breathing issues, seek emergency care.";
        } else {
          expertResponse = "Thanks for the message. Could you please share more details about your concerns?";
        }

        await db.collection('chats').add({
          sender: 'expert',
          expertId: selectedExpert.id,
          message: expertResponse,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }, 1000);

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to send message',
        text2: error.message,
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedExpert) return;

    const unsubscribe = db.collection('chats')
      .where('expertId', '==', selectedExpert.id)
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatHistory(messages);
      });

    return unsubscribe;
  }, [selectedExpert]);

  const renderExpertCard = ({ item }) => (
    <TouchableOpacity
      style={styles.expertCard}
      onPress={() => startChat(item)}
      disabled={!item.available}
    >
      <Image source={{ uri: item.avatar }} style={styles.expertAvatar} />
      <View style={styles.expertInfo}>
        <Text style={styles.expertName}>{item.name}</Text>
        <Text style={styles.expertRole}>{item.role}</Text>
        <Text style={styles.expertSpecialty}>{item.specialty}</Text>
        <View style={styles.expertRating}>
          <FontAwesome name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
        </View>
      </View>
      <View style={[
        styles.availabilityBadge,
        { backgroundColor: item.available ? '#dcfce7' : '#f1f5f9' }
      ]}>
        <Text style={[
          styles.availabilityText,
          { color: item.available ? '#166534' : '#64748b' }
        ]}>
          {item.available ? 'Available' : 'Offline'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderChatMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.expertMessage
    ]}>
      {item.sender === 'expert' && (
        <Image source={{ uri: selectedExpert.avatar }} style={styles.messageSenderAvatar} />
      )}
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.expertBubble
      ]}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.messageTime}>
          {item.timestamp && new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showChat ? `Chat with ${selectedExpert?.name}` : 'Expert Help'}
        </Text>
        <View style={{ width: 20 }} />
      </View>

      {!showChat ? (
        <View style={styles.expertListContainer}>
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={18} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search experts..."
              placeholderTextColor="#8e8e93"
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <FlatList
            data={filteredExperts}
            keyExtractor={item => item.id}
            renderItem={renderExpertCard}
            contentContainerStyle={styles.expertListContent}
          />
        </View>
      ) : (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setShowChat(false)} style={styles.backToExperts}>
              <FontAwesome name="arrow-left" size={16} color="#041c33ff" />
              <Text style={styles.backToExpertsText}>Back to experts</Text>
            </TouchableOpacity>
            <Text style={styles.chatExpertName}>{selectedExpert?.name}</Text>
            <Text style={styles.chatExpertRole}>{selectedExpert?.role}</Text>
          </View>
          
          <FlatList
            data={chatHistory}
            keyExtractor={item => item.id.toString()}
            renderItem={renderChatMessage}
            contentContainerStyle={styles.chatHistory}
          />
          
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message..."
              placeholderTextColor="#8e8e93"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.disabledSendButton]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <FontAwesome name="paper-plane" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Toast />
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
  expertListContainer: {
    flex: 1,
    padding: 16,
  },
  expertListContent: {
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
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
  expertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  expertAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#041c33ff',
  },
  expertInfo: {
    flex: 1,
    marginLeft: 12,
  },
  expertName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041c33ff',
  },
  expertRole: {
    fontSize: 14,
    color: '#4C6EF5',
    marginTop: 2,
  },
  expertSpecialty: {
    fontSize: 13,
    color: '#8e8e93',
    marginTop: 4,
  },
  expertRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 4,
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    alignItems: 'center',
  },
  backToExperts: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backToExpertsText: {
    color: '#041c33ff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  chatExpertName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#041c33ff',
  },
  chatExpertRole: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  chatHistory: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  expertMessage: {
    justifyContent: 'flex-start',
  },
  messageSenderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#d2dfebff',
    borderBottomRightRadius: 4,
  },
  expertBubble: {
    backgroundColor: '#f1f5f9',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#041c33ff',
  },
  userMessageText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 11,
    color: '#8e8e93',
    marginTop: 4,
    textAlign: 'right',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#041c33ff',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#041c33ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: '#e9ecef',
  },
});