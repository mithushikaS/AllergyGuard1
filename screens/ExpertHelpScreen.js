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

    // Note: This query requires a composite index in Firestore
    // Collection: chats
    // Fields to index:
    // - expertId (Ascending)
    // - timestamp (Ascending)
    // You can create this index at: https://console.firebase.google.com/v1/r/project/allergyguard-44fe9/firestore/indexes?create_composite=ClBwcm9qZWN0cy9hbGxlcmd5Z3VhcmQtNDRmZTkvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2NoYXRzL2luZGV4ZXMvXxABGgwKC
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
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showChat ? `Chat with ${selectedExpert?.name}` : 'Expert Help'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {!showChat ? (
        <View style={styles.expertListContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search experts..."
            value={query}
            onChangeText={setQuery}
          />
          <FlatList
            data={filteredExperts}
            keyExtractor={item => item.id}
            renderItem={renderExpertCard}
          />
        </View>
      ) : (
        <View style={styles.chatContainer}>
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
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.disabledSendButton]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <FontAwesome name="paper-plane" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  header: { backgroundColor: '#4C6EF5', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 5 },
  searchInput: { backgroundColor: '#fff', padding: 10, margin: 15, borderRadius: 8 },
  expertListContainer: { flex: 1 },
  expertCard: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 5, borderRadius: 10, alignItems: 'center' },
  expertAvatar: { width: 60, height: 60, borderRadius: 30 },
  expertInfo: { flex: 1, marginHorizontal: 10 },
  expertName: { fontSize: 16, fontWeight: 'bold' },
  expertRole: { fontSize: 14, color: '#4C6EF5' },
  expertSpecialty: { fontSize: 12, color: '#666' },
  expertRating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 5, fontSize: 12, color: '#999' },
  availabilityBadge: { padding: 6, borderRadius: 10 },
  availabilityText: { fontSize: 12 },
  chatContainer: { flex: 1 },
  chatHistory: { padding: 10 },
  messageContainer: { flexDirection: 'row', marginVertical: 5 },
  userMessage: { justifyContent: 'flex-end' },
  expertMessage: { justifyContent: 'flex-start' },
  messageSenderAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  messageBubble: { padding: 10, borderRadius: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: '#4C6EF5', alignSelf: 'flex-end' },
  expertBubble: { backgroundColor: '#e5e7eb', alignSelf: 'flex-start' },
  messageText: { color: '#000' },
  messageTime: { fontSize: 10, color: '#555', marginTop: 4 },
  messageInputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
  messageInput: { flex: 1, backgroundColor: '#f1f1f1', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10 },
  sendButton: { marginLeft: 10, backgroundColor: '#4C6EF5', padding: 12, borderRadius: 20 },
  disabledSendButton: { backgroundColor: '#ccc' },
});