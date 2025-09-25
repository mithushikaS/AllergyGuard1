import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

const ALLERGY_CATEGORIES = [
  { id: '1', name: 'Nuts', icon: 'tree', color: '#F59E0B', iconFamily: 'FontAwesome' },
  { id: '2', name: 'Dairy', icon: 'glass', color: '#38B2AC', iconFamily: 'FontAwesome' },
  { id: '3', name: 'Seafood', icon: 'fish', color: '#4F46E5', iconFamily: 'MaterialCommunityIcons' },
  { id: '4', name: 'Gluten', icon: 'grain', color: '#D97706', iconFamily: 'MaterialCommunityIcons' },
  { id: '5', name: 'Eggs', icon: 'egg', color: '#10B981', iconFamily: 'MaterialCommunityIcons' },
  { id: '6', name: 'Soy', icon: 'grain', color: '#7C3AED', iconFamily: 'MaterialCommunityIcons' },
  { id: '7', name: 'Medicines', icon: 'pill', color: '#DC2626', iconFamily: 'MaterialCommunityIcons' },
];

const ALLERGEN_SUGGESTIONS = [
  'Peanuts', 'Almonds', 'Walnuts', 'Cashews',
  'Wheat', 'Milk', 'Eggs', 'Shellfish', 'Fish',
  'Soy', 'Penicillin', 'Latex', 'Gluten',
  'Aspirin', 'Ibuprofen', 'MSG', 'Sulfites'
];

export default function MyAllergiesScreen() {
  const navigation = useNavigation();
  const [allergyText, setAllergyText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userAllergies, setUserAllergies] = useState([
    { id: '101', name: 'Peanuts', severity: 'Severe' },
    { id: '102', name: 'Penicillin', severity: 'Moderate' },
    { id: '103', name: 'Lactose', severity: 'Mild' },
  ]);

  const goBack = () => navigation.goBack();

  const handleAllergyTextChange = (text) => {
    setAllergyText(text);
    if (text.length > 1) {
      const filtered = ALLERGEN_SUGGESTIONS.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addAllergy = (allergyName = allergyText) => {
    if (!allergyName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter an allergy name'
      });
      return;
    }

    if (userAllergies.some(allergy => allergy.name.toLowerCase() === allergyName.toLowerCase())) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'This allergy is already in your list'
      });
      return;
    }

    const newAllergy = {
      id: Date.now().toString(),
      name: allergyName,
      severity: 'Moderate'
    };

    setUserAllergies([...userAllergies, newAllergy]);
    setAllergyText('');
    setSuggestions([]);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Allergy added successfully'
    });
  };

  const removeAllergy = (id) => {
    setUserAllergies(userAllergies.filter(allergy => allergy.id !== id));
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Allergy removed'
    });
  };

  const updateAllergySeverity = (id, severity) => {
    setUserAllergies(
      userAllergies.map(allergy =>
        allergy.id === id ? { ...allergy, severity } : allergy
      )
    );
  };

  const renderSeverityButton = (allergySeverity, itemId, severity, color, label) => {
    const isSelected = allergySeverity === severity;
    return (
      <TouchableOpacity
        style={[
          styles.severityButton,
          { 
            backgroundColor: isSelected ? color : '#f1f5f9',
            borderColor: isSelected ? color : '#e5e7eb'
          }
        ]}
        onPress={() => updateAllergySeverity(itemId, severity)}
      >
        <Text style={{
          color: isSelected ? '#fff' : '#041c33ff',
          fontWeight: isSelected ? '600' : '500'
        }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Allergies</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add New Allergy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Allergy</Text>
          <View style={styles.searchInputContainer}>
            <FontAwesome name="search" size={18} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Type allergen name..."
              placeholderTextColor="#8e8e93"
              value={allergyText}
              onChangeText={handleAllergyTextChange}
              onSubmitEditing={() => addAllergy()}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addAllergy()}
            >
              <FontAwesome name="plus" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => addAllergy(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  <FontAwesome name="plus" size={14} color="#041c33ff" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Common Allergies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Allergies</Text>
          <View style={styles.categoryContainer}>
            {ALLERGY_CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => addAllergy(category.name)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: `${category.color}20` }
                  ]}
                >
                  {category.iconFamily === 'FontAwesome' ? (
                    <FontAwesome name={category.icon} size={20} color={category.color} />
                  ) : (
                    <MaterialCommunityIcons name={category.icon} size={20} color={category.color} />
                  )}
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Your Allergies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Allergies</Text>
          <View style={styles.allergiesList}>
            {userAllergies.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  You haven't added any allergies yet
                </Text>
              </View>
            ) : (
              userAllergies.map(allergy => (
                <View key={allergy.id} style={styles.allergyItem}>
                  <View style={styles.allergyHeader}>
                    <Text style={styles.allergyName}>{allergy.name}</Text>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => removeAllergy(allergy.id)}
                    >
                      <FontAwesome name="trash" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.severityLabel}>Severity Level</Text>
                  <View style={styles.severityContainer}>
                    {renderSeverityButton(allergy.severity, allergy.id, 'Mild', '#10B981', 'Mild')}
                    {renderSeverityButton(allergy.severity, allergy.id, 'Moderate', '#F59E0B', 'Moderate')}
                    {renderSeverityButton(allergy.severity, allergy.id, 'Severe', '#DC2626', 'Severe')}
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <FontAwesome name="info-circle" size={18} color="#041c33ff" />
          <Text style={styles.infoText}>
            Add your known allergies to receive alerts when scanning products with allergenic ingredients. 
            Setting the severity helps prioritize warnings.
          </Text>
        </View>
      </ScrollView>
       <BottomNav isExpert={false} navigateTo={navigation.navigate} />
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
  content: {
    flex: 1,
    padding: 16,
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
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#041c33ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  suggestionsContainer: {
    marginTop: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    maxHeight: 160,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 15,
    color: '#041c33ff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#041c33ff',
    textAlign: 'center',
  },
  allergiesList: {
    gap: 12,
  },
  allergyItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  allergyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041c33ff',
  },
  deleteButton: {
    padding: 6,
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#64748b',
    fontStyle: 'italic',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#041c33ff',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#041c33ff',
    lineHeight: 20,
  },
});