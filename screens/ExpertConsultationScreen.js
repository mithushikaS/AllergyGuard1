// screens/ExpertConsultationScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

// Mock consultation data
const MOCK_CONSULTATIONS = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.a0.dev/assets/image?text=user+1&aspect=1:1',
    lastMessage: 'Is hydrolyzed wheat protein safe for celiac disease?',
    timestamp: '10 min ago',
    unread: true,
    status: 'active',
  },
  {
    id: '2',
    userName: 'Mike Chen',
    userAvatar: 'https://api.a0.dev/assets/image?text=user+2&aspect=1:1',
    lastMessage: 'My child has peanut allergy symptoms after eating cookies',
    timestamp: '1 hour ago',
    unread: false,
    status: 'active',
  },
  {
    id: '3',
    userName: 'Emma Davis',
    userAvatar: 'https://api.a0.dev/assets/image?text=user+3&aspect=1:1',
    lastMessage: 'Thank you for the advice about dairy alternatives!',
    timestamp: '2 days ago',
    unread: false,
    status: 'completed',
  },
];

export default function ExpertConsultationScreen() {
  const navigation = useNavigation();
  const [consultations, setConsultations] = useState(MOCK_CONSULTATIONS);
  const [activeTab, setActiveTab] = useState('active');

  const filteredConsultations = consultations.filter(
    consultation => consultation.status === activeTab
  );

  const goBack = () => navigation.goBack();

  const navigateToChat = (consultation) => {
    navigation.navigate('ExpertChat', { consultation });
  };

  const renderConsultationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.consultationItem}
      onPress={() => navigateToChat(item)}
    >
      <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        <Text style={styles.lastMessage} numberOfLines={2}>
          {item.lastMessage}
        </Text>
        
        <View style={styles.footer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'active' ? '#DCFCE7' : '#F1F5F9' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'active' ? '#166534' : '#64748B' }
            ]}>
              {item.status === 'active' ? 'Active' : 'Completed'}
            </Text>
          </View>
          
          {item.unread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>New</Text>
            </View>
          )}
        </View>
      </View>
      
      <MaterialIcons name="chevron-right" size={20} color={COLORS.darkGray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
         <TouchableOpacity style={styles.backButton} onPress={goBack}>
                  <MaterialIcons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultations</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Consultation List */}
      <FlatList
        data={filteredConsultations}
        keyExtractor={(item) => item.id}
        renderItem={renderConsultationItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="chat" size={60} color={COLORS.darkGray} />
            <Text style={styles.emptyTitle}>No {activeTab} consultations</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active' 
                ? 'New consultation requests will appear here'
                : 'Completed consultations will appear here'
              }
            </Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  backButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  consultationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
});