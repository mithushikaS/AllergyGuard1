import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { logout, userRole } = useContext(AuthContext);
  const isExpert = userRole === 'expert';

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    logout();
  };

  // Mock recent scans data - replace with your actual data
  const recentScans = [
    { id: 1, name: 'Peanut Butter', date: '2 hours ago', safe: true },
    { id: 2, name: 'Granola Bar', date: '1 day ago', safe: false },
    { id: 3, name: 'Chocolate Chip Cookies', date: '3 days ago', safe: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.logo}>AllergyGuard</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <View style={styles.notificationBadge}>
              <MaterialIcons name="logout" size={22} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigateTo('Profile')}>
            <View style={styles.profileBadge}>
              <MaterialCommunityIcons name="account-circle" size={26} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ 
              uri: isExpert 
                ? 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' 
                : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' 
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(15,23,42,0.8)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroTitle}>
              {isExpert ? 'Expert Dashboard' : 'Stay Safe from Allergens'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {isExpert 
                ? 'Help users with their allergy concerns' 
                : 'Scan products to check if they\'re safe for you'
              }
            </Text>
          </LinearGradient>
        </View>

        {isExpert ? (
          // Expert Home Content
          <>
            {/* Quick Actions for Expert */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.consultButton]} 
                onPress={() => navigateTo('ExpertHelp')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#A855F7']}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.actionButtonIcon}>
                    <MaterialIcons name="chat" size={28} color="#fff" />
                  </View>
                  <Text style={styles.actionButtonText}>Consultations</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.searchButton]} 
                onPress={() => navigateTo('SearchProduct')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#06B6D4', '#0891B2']}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.actionButtonIcon}>
                    <FontAwesome name="search" size={24} color="#fff" />
                  </View>
                  <Text style={styles.actionButtonText}>Search Products</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Active Consultations Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Consultations</Text>
              <View style={styles.consultationCard}>
                <View style={styles.consultationHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <MaterialCommunityIcons name="account-circle" size={40} color="#6366F1" />
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>Sarah Johnson</Text>
                      <Text style={styles.consultationTime}>Started 10 minutes ago</Text>
                    </View>
                  </View>
                  <View style={styles.statusBadgeContainer}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Active</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.consultationQuery}>
                  I found a product with "hydrolyzed wheat protein". Is this safe for someone with celiac disease?
                </Text>
                <TouchableOpacity style={styles.respondButton}>
                  <Text style={styles.respondButtonText}>Respond</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Expertise Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Expertise</Text>
              <View style={styles.expertiseCard}>
                <Text style={styles.expertiseTitle}>Specialization</Text>
                <View style={styles.specializationTag}>
                  <Text style={styles.specializationText}>Allergist</Text>
                </View>
                <Text style={styles.expertiseTitle}>Response Rate</Text>
                <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={16} color="#F59E0B" />
                  <MaterialIcons name="star" size={16} color="#F59E0B" />
                  <MaterialIcons name="star" size={16} color="#F59E0B" />
                  <MaterialIcons name="star" size={16} color="#F59E0B" />
                  <MaterialIcons name="star-half" size={16} color="#F59E0B" />
                  <Text style={styles.ratingText}>4.5 (32 reviews)</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          // Regular User Home Content
          <>
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.scanButton]} 
                onPress={() => navigateTo('ScanProduct')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.actionButtonIcon}>
                    <MaterialIcons name="camera-alt" size={28} color="#fff" />
                  </View>
                  <Text style={styles.actionButtonText}>Scan Product</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.searchButton]} 
                onPress={() => navigateTo('SearchProduct')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#06B6D4', '#0891B2']}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.actionButtonIcon}>
                    <FontAwesome name="search" size={24} color="#fff" />
                  </View>
                  <Text style={styles.actionButtonText}>Search</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Recent Scans Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Scans</Text>
                <TouchableOpacity onPress={() => navigateTo('ScanHistory')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {recentScans.length > 0 ? (
                <View style={styles.recentScansContainer}>
                  {recentScans.map((scan, index) => (
                    <TouchableOpacity 
                      key={scan.id} 
                      style={[
                        styles.recentScanCard,
                        index === recentScans.length - 1 && styles.lastScanCard
                      ]}
                      onPress={() => navigateTo('ScanDetails', { scanId: scan.id })}
                    >
                      <View style={[
                        styles.recentScanIcon,
                        { backgroundColor: scan.safe ? '#DCFCE7' : '#FEF2F2' }
                      ]}>
                        <MaterialIcons 
                          name={scan.safe ? "check-circle" : "warning"} 
                          size={20} 
                          color={scan.safe ? "#22C55E" : "#EF4444"} 
                        />
                      </View>
                      <View style={styles.recentScanInfo}>
                        <Text style={styles.recentScanName} numberOfLines={1}>{scan.name}</Text>
                        <Text style={styles.recentScanDate}>{scan.date}</Text>
                      </View>
                      <View style={styles.chevronContainer}>
                        <MaterialIcons name="chevron-right" size={18} color="#94A3B8" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.recentScansEmpty}>
                  <View style={styles.emptyIconContainer}>
                    <MaterialIcons name="photo-camera" size={32} color="#94A3B8" />
                  </View>
                  <Text style={styles.emptyText}>No recent scans</Text>
                  <Text style={styles.emptySubText}>Scanned products will appear here</Text>
                </View>
              )}
            </View>

            {/* Expert Help Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Expert Help</Text>
              <TouchableOpacity 
                style={styles.expertHelpCard}
                onPress={() => navigateTo('ExpertHelp')}
                activeOpacity={0.8}
              >
                <View style={styles.expertHelpContent}>
                  <View style={styles.expertHelpIcon}>
                    <MaterialCommunityIcons name="doctor" size={24} color="#6366F1" />
                  </View>
                  <View style={styles.expertHelpText}>
                    <Text style={styles.expertHelpTitle}>Connect with a Health Expert</Text>
                    <Text style={styles.expertHelpSubtitle}>
                      Get advice from doctors and pharmacists about your allergies
                    </Text>
                  </View>
                  <View style={styles.chevronContainer}>
                    <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Allergy Tips Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Allergy Tips</Text>
                <TouchableOpacity onPress={() => navigateTo('Tips')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <View style={styles.tipIconContainer}>
                    <MaterialIcons name="lightbulb" size={18} color="#F59E0B" />
                  </View>
                  <Text style={styles.tipTitle}>Read labels carefully</Text>
                </View>
                <Text style={styles.tipText}>
                  Manufacturers may change ingredients without notice. Always double-check labels, 
                  even for products you regularly use.
                </Text>
              </View>
            </View>

            {/* Emergency Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency</Text>
              <TouchableOpacity 
                style={styles.emergencyCard}
                onPress={() => navigateTo('Emergency')}
                activeOpacity={0.8}
              >
                <View style={styles.emergencyContent}>
                  <View style={styles.emergencyIcon}>
                    <MaterialIcons name="warning" size={24} color="#EF4444" />
                  </View>
                  <View style={styles.emergencyText}>
                    <Text style={styles.emergencyTitle}>Allergic Reaction?</Text>
                    <Text style={styles.emergencySubtitle}>
                      Get immediate help and emergency instructions
                    </Text>
                  </View>
                  <View style={styles.chevronContainer}>
                    <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerTab, styles.activeFooterTab]} 
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <View style={styles.activeTabIndicator}>
            <MaterialIcons name="home" size={22} color="#6366F1" />
          </View>
          <Text style={[styles.footerTabText, styles.activeTabText]}>Home</Text>
        </TouchableOpacity>
        
        {!isExpert && (
          <TouchableOpacity 
            style={styles.footerTab} 
            onPress={() => navigateTo('ScanProduct')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="barcode-scan" size={22} color="#64748B" />
            <Text style={styles.footerTabText}>Scan</Text>
          </TouchableOpacity>
        )}
        
        {isExpert ? (
          <TouchableOpacity 
            style={styles.footerTab} 
            onPress={() => navigateTo('ExpertHelp')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="chat" size={22} color="#64748B" />
            <Text style={styles.footerTabText}>Consult</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.footerTab} 
            onPress={() => navigateTo('MyAllergies')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="warning" size={22} color="#64748B" />
            <Text style={styles.footerTabText}>Allergies</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.footerTab} 
          onPress={() => navigateTo('Profile')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="person" size={22} color="#64748B" />
          <Text style={styles.footerTabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  logo: {
    fontSize: 24,
    fontFamily: 'sans-serif-medium',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
  notificationBadge: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  profileBadge: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    height: 220,
    marginBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 48,
  },
  heroTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 16,
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: -0.2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  actionButtonGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
  },
  actionButtonIcon: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  seeAllText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  recentScansContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  recentScanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastScanCard: {
    borderBottomWidth: 0,
  },
  recentScanIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recentScanInfo: {
    flex: 1,
  },
  recentScanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  recentScanDate: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '400',
  },
  chevronContainer: {
    padding: 4,
  },
  recentScansEmpty: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  emptyIconContainer: {
    backgroundColor: '#F1F5F9',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  emptySubText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '400',
  },
  expertHelpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  expertHelpContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expertHelpIcon: {
    backgroundColor: '#EEF2FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  expertHelpText: {
    flex: 1,
  },
  expertHelpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  expertHelpSubtitle: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIconContainer: {
    backgroundColor: '#FEF3C7',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  tipText: {
    color: '#475569',
    lineHeight: 22,
    fontSize: 14,
    fontWeight: '400',
  },
  emergencyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  emergencyContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyIcon: {
    backgroundColor: '#FEF2F2',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  emergencySubtitle: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  // Expert-specific styles
  consultationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  consultationHeader: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  consultationTime: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '400',
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  consultationQuery: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '400',
  },
  respondButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  respondButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: -0.1,
  },
  expertiseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  expertiseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  specializationTag: {
    backgroundColor: '#E0F2FE',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  specializationText: {
    color: '#0369A1',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: -0.1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  footerTab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 60,
  },
  activeFooterTab: {
    backgroundColor: '#F1F5F9',
  },
  activeTabIndicator: {
    backgroundColor: '#EEF2FF',
    padding: 6,
    borderRadius: 12,
  },
  footerTabText: {
    fontSize: 12,
    marginTop: 6,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: '600',
  },
});