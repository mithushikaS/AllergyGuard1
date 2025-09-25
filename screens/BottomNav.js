import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Theme colors (you can import from a shared theme file if you want)
const COLORS = {
  primary: '#041c33ff',
  white: '#FFFFFF',
};

const BottomNav = ({ isExpert, navigateTo }) => {
  return (
    <View style={styles.bottomNav}>
      <NavItem
        icon={<MaterialIcons name="home" size={24} color={COLORS.white} />}
        label="Home"
        onPress={() => navigateTo('Home')}
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
  );
};

const NavItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <View style={styles.navIcon}>{icon}</View>
    <Text style={styles.navLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
  navIcon: {
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
  },
});

export default BottomNav;
