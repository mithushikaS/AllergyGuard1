import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

// Theme colors
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

export default function HomeScreen() {
  const navigation = useNavigation();
  const { logout, userRole } = useContext(AuthContext);
  const isExpert = userRole === 'expert';

  const navigateTo = (screen) => navigation.navigate(screen);

  // Mock data
  const recentScans = [
    { id: 1, name: 'Peanut Butter', date: '2 hours ago', safe: true },
    { id: 2, name: 'Granola Bar', date: '1 day ago', safe: false },
    { id: 3, name: 'Chocolate Chip Cookies', date: '3 days ago', safe: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}></Text>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>AllergyGuard</Text>
          <TouchableOpacity onPress={() => logout()} style={styles.iconButton}>
            <MaterialIcons name="logout" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ 
              uri: isExpert 
                ? 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' 
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {isExpert ? 'Expert Dashboard' : 'Stay Safe From Allergens'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {isExpert ? 'Manage your consultations' : 'Scan products for allergens'}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.greeting}></Text>
          <View style={styles.actionTiles}>
            {isExpert ? (
              <>
                <ActionTile 
                  icon={<MaterialIcons name="chat" size={28} color={COLORS.white} />}
                  label="Consultations"
                  onPress={() => navigateTo('ExpertConsultation')}
                />
                <ActionTile 
                  icon={<FontAwesome name="search" size={24} color={COLORS.white} />}
                  label="Search"
                  onPress={() => navigateTo('SearchProduct')}
                />
                <ActionTile 
                  icon={<MaterialIcons name="library-books" size={24} color={COLORS.white} />}
                  label="Resources"
                  onPress={() => navigateTo('ExpertResources')}
                />
              </>
            ) : (
              <>
                <ActionTile 
                  icon={<MaterialIcons name="camera-alt" size={28} color={COLORS.white} />}
                  label="Scan"
                  onPress={() => navigateTo('ScanProduct')}
                />
                <ActionTile 
                  icon={<FontAwesome name="search" size={24} color={COLORS.white} />}
                  label="Search"
                  onPress={() => navigateTo('SearchProduct')}
                />
                <ActionTile 
                  icon={<MaterialCommunityIcons name="doctor" size={24} color={COLORS.white} />}
                  label="Expert Help"
                  onPress={() => navigateTo('ExpertHelp')}
                />
              </>
            )}
          </View>
        </View>

        {/* Main Content Sections */}
        {isExpert ? (
          <>
            <Section title="Active Consultations" action="See All" onActionPress={() => navigateTo('Consultations')}>
              <ConsultationCard 
                userName="Sarah Johnson"
                time="10 minutes ago"
                question="Is hydrolyzed wheat protein safe for celiac disease?"
                onPress={() => navigateTo('ExpertChat')}
              />
              <EmptyState 
                icon={<MaterialIcons name="chat" size={40} color={COLORS.darkGray} />}
                title="No active consultations"
                subtitle="New requests will appear here"
              />
            </Section>

            <Section title="Your Expertise">
              <ExpertiseCard 
                specialization="Allergist"
                rating={4.5}
                reviews={32}
                responseRate="98%"
              />
            </Section>
          </>
        ) : (
          <>
            <Section title="Recent Scans" action="See All" onActionPress={() => navigateTo('ScanHistory')}>
              {recentScans.length > 0 ? (
                recentScans.map((scan, index) => (
                  <ScanItem 
                    key={scan.id}
                    name={scan.name}
                    date={scan.date}
                    safe={scan.safe}
                    isLast={index === recentScans.length - 1}
                    onPress={() => navigateTo('ScanDetails', { scanId: scan.id })}
                  />
                ))
              ) : (
                <EmptyState 
                  icon={<MaterialIcons name="photo-camera" size={40} color={COLORS.darkGray} />}
                  title="No recent scans"
                  subtitle="Your scans will appear here"
                />
              )}
            </Section>

            <Section title="Allergy Tips">
              <TipCard 
                icon={<Ionicons name="shield-checkmark" size={20} color={COLORS.warning} />}
                title="Check labels carefully"
                text="Manufacturers may change ingredients without notice."
              />
              <TipCard 
                icon={<MaterialCommunityIcons name="allergy" size={20} color={COLORS.warning} />}
                title="Carry emergency meds"
                text="Always have your epinephrine auto-injector with you."
                style={{ marginTop: 12 }}
              />
            </Section>

            <Section title="Emergency">
              <FeatureCard 
                icon={<MaterialIcons name="warning" size={28} color={COLORS.danger} />}
                title="Allergic Reaction?"
                description="Get emergency instructions"
                onPress={() => navigateTo('Emergency')}
              />
            </Section>
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem 
          icon={<MaterialIcons name="home" size={24} color={COLORS.white} />}
          label="Home"
          active
          onPress={() => {}}
        />
        {!isExpert && (
          <NavItem 
            icon={<MaterialCommunityIcons name="barcode-scan" size={24} color={COLORS.white} />}
            label="Scan"
            onPress={() => navigateTo('ScanProduct')}
          />
        )}
        {isExpert ? (
          <NavItem 
            icon={<MaterialIcons name="chat" size={24} color={COLORS.white} />}
            label="Consult"
            onPress={() => navigateTo('ExpertConsultation')}
          />
        ) : (
          <NavItem 
            icon={<MaterialCommunityIcons name="allergy" size={24} color={COLORS.white} />}
            label="Allergies"
            onPress={() => navigateTo('MyAllergies')}
          />
        )}
        <NavItem 
          icon={<MaterialIcons name="person" size={24} color={COLORS.white} />}
          label="Profile"
          onPress={() => navigateTo('Profile')}
        />
      </View>
    </SafeAreaView>
  );
}

// Reusable Components
const ActionTile = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionTile} onPress={onPress}>
    <View style={styles.actionIconContainer}>
      {icon}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const Section = ({ title, action, onActionPress, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

const ScanItem = ({ name, date, safe, isLast, onPress }) => (
  <TouchableOpacity 
    style={[styles.scanItem, !isLast && styles.scanItemBorder]}
    onPress={onPress}
  >
    <View style={[styles.scanStatus, safe ? styles.scanSafe : styles.scanDanger]}>
      <MaterialIcons 
        name={safe ? "check-circle" : "warning"} 
        size={20} 
        color={safe ? COLORS.success : COLORS.danger} 
      />
    </View>
    <View style={styles.scanInfo}>
      <Text style={styles.scanName} numberOfLines={1}>{name}</Text>
      <Text style={styles.scanDate}>{date}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={20} color={COLORS.darkGray} />
  </TouchableOpacity>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIcon}>{icon}</View>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptySubtitle}>{subtitle}</Text>
  </View>
);

const FeatureCard = ({ icon, title, description, onPress }) => (
  <TouchableOpacity style={styles.featureCard} onPress={onPress}>
    <View style={styles.featureIcon}>{icon}</View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color={COLORS.darkGray} />
  </TouchableOpacity>
);

const TipCard = ({ icon, title, text, style }) => (
  <View style={[styles.tipCard, style]}>
    <View style={styles.tipHeader}>
      <View style={styles.tipIcon}>{icon}</View>
      <Text style={styles.tipTitle}>{title}</Text>
    </View>
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

const ConsultationCard = ({ userName, time, question, onPress }) => (
  <View style={styles.consultationCard}>
    <View style={styles.consultationHeader}>
      <View style={styles.userAvatar}>
        <MaterialCommunityIcons name="account-circle" size={40} color={COLORS.primary} />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.consultationTime}>{time}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Active</Text>
      </View>
    </View>
    <Text style={styles.consultationText}>{question}</Text>
    <TouchableOpacity style={styles.respondButton} onPress={onPress}>
      <Text style={styles.buttonText}>Respond</Text>
    </TouchableOpacity>
  </View>
);

const ExpertiseCard = ({ specialization, rating, reviews, responseRate }) => (
  <View style={styles.expertiseCard}>
    <View style={styles.expertiseRow}>
      <Text style={styles.cardSubtitle}>Specialization:</Text>
      <View style={styles.specializationTag}>
        <Text style={styles.specializationText}>{specialization}</Text>
      </View>
    </View>
    <View style={styles.expertiseRow}>
      <Text style={styles.cardSubtitle}>Rating:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <MaterialIcons 
            key={i} 
            name={i <= Math.floor(rating) ? "star" : i === Math.ceil(rating) ? "star-half" : "star-border"} 
            size={16} 
            color={COLORS.warning} 
          />
        ))}
        <Text style={styles.ratingText}>{rating} ({reviews} reviews)</Text>
      </View>
    </View>
    <View style={styles.expertiseRow}>
      <Text style={styles.cardSubtitle}>Response Rate:</Text>
      <Text style={styles.responseRateText}>{responseRate}</Text>
    </View>
  </View>
);

const NavItem = ({ icon, label, active = false, onPress }) => (
  <TouchableOpacity 
    style={styles.navItem}
    onPress={onPress}
  >
    <View style={[styles.navIcon, active && styles.navIconActive]}>
      {icon}
    </View>
    <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    paddingBottom: 80,
    backgroundColor: COLORS.lightGray,
  },
  heroBanner: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 28, 51, 0.5)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionAction: {
    color: COLORS.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  actionTiles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionTile: {
    width: '30%',
    marginBottom: 16,
    alignItems: 'center',
  },
  actionIconContainer: {
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    textAlign: 'center',
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scanStatus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scanSafe: {
    backgroundColor: '#10B98120',
  },
  scanDanger: {
    backgroundColor: '#EF444420',
  },
  scanInfo: {
    flex: 1,
  },
  scanName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 4,
  },
  scanDate: {
    fontSize: 13,
    color: COLORS.darkGray,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    backgroundColor: '#F1F5F9',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
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
    color: COLORS.primary,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  consultationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  consultationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  consultationTime: {
    fontSize: 13,
    color: COLORS.darkGray,
  },
  statusBadge: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.success,
    fontWeight: '600',
    fontSize: 12,
  },
  consultationText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 16,
    lineHeight: 20,
  },
  respondButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  expertiseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  expertiseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginRight: 8,
  },
  specializationTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specializationText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 14,
  },
  responseRateText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
// In your Stylesheet
bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.primary, 
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)', 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
},
navItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    width: '25%', 
},
navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.15)', 
},
navIcon: {
    marginBottom: 4,
},
navIconActive: {
    
},
navLabel: {
    fontSize: 12,
    color: COLORS.white, 
    opacity: 0.8, 
},
navLabelActive: {
    color: COLORS.white,
    fontWeight: '600',
    opacity: 1, 
},
});