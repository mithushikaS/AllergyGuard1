// screens/ExpertResourcesScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

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

const RESOURCES = [
  {
    id: '1',
    title: 'Allergy Guidelines',
    description: 'Latest clinical practice guidelines for allergy management',
    icon: '📋',
    type: 'guideline',
    link: 'https://www.aaaai.org/practice-resources/practice-parameters',
  },
  {
    id: '2',
    title: 'Drug Allergy Database',
    description: 'Comprehensive database of drug allergies and cross-reactivities',
    icon: '💊',
    type: 'database',
    link: 'https://www.drugs.com/drug-interactions/',
  },
  {
    id: '3',
    title: 'Anaphylaxis Protocol',
    description: 'Emergency response protocol for anaphylactic reactions',
    icon: '🚨',
    type: 'protocol',
    link: 'https://www.aaaai.org/conditions-and-treatments/library/at-a-glance/anaphylaxis',
  },
  {
    id: '4',
    title: 'Patient Education Materials',
    description: 'Resources to share with patients about allergy management',
    icon: '👥',
    type: 'education',
    link: 'https://www.foodallergy.org/resources',
  },
  {
    id: '5',
    title: 'Research Updates',
    description: 'Latest research findings in allergy and immunology',
    icon: '🔬',
    type: 'research',
    link: 'https://www.jacionline.org/',
  },
  {
    id: '6',
    title: 'Training Modules',
    description: 'Continuing education modules for healthcare professionals',
    icon: '🎓',
    type: 'training',
    link: 'https://www.acaai.org/education/online-education',
  },
];

export default function ExpertResourcesScreen() {
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();

  const handleResourcePress = async (resource) => {
    try {
      await Linking.openURL(resource.link);
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  };

  const getIconColor = (type) => {
    const colors = {
      guideline: COLORS.success,
      database: COLORS.accent,
      protocol: COLORS.danger,
      education: COLORS.warning,
      research: COLORS.primary,
      training: '#8B5CF6',
    };
    return colors[type] || COLORS.primary;
  };

  const ResourceCard = ({ resource }) => (
    <TouchableOpacity 
      style={styles.resourceCard}
      onPress={() => handleResourcePress(resource)}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getIconColor(resource.type)}20` }]}>
        <Text style={styles.emojiIcon}>{resource.icon}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{resource.title}</Text>
        <Text style={styles.description}>{resource.description}</Text>
        
        <View style={styles.footer}>
          <View style={[styles.typeBadge, { backgroundColor: getIconColor(resource.type) }]}>
            <Text style={styles.typeText}>{resource.type}</Text>
          </View>
          
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Open Resource</Text>
            <MaterialIcons name="open-in-new" size={16} color={COLORS.accent} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expert Resources</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.introSection}>
          <Ionicons name="library" size={40} color={COLORS.primary} />
          <Text style={styles.introTitle}>Professional Resources</Text>
          <Text style={styles.introText}>
            Access the latest guidelines, research, and educational materials to support your practice in allergy care.
          </Text>
        </View>

        {/* Resources Grid */}
        <View style={styles.resourcesGrid}>
          {RESOURCES.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="download" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Download All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="bookmark" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Bookmarks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  introSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.lightGray,
    margin: 16,
    borderRadius: 12,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  resourcesGrid: {
    paddingHorizontal: 16,
  },
  resourceCard: {
    flexDirection: 'row',
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
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emojiIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});