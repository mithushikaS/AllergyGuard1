import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Common allergy categories to choose from
const ALLERGY_CATEGORIES = [
  { id: '1', name: 'Nuts', icon: 'tree', color: '#F59E0B', iconFamily: 'FontAwesome' },
  { id: '2', name: 'Dairy', icon: 'glass', color: '#38B2AC', iconFamily: 'FontAwesome' },
  { id: '3', name: 'Seafood', icon: 'fish', color: '#4F46E5', iconFamily: 'MaterialCommunityIcons' },
  { id: '4', name: 'Gluten', icon: 'grain', color: '#D97706', iconFamily: 'MaterialCommunityIcons' },
  { id: '5', name: 'Eggs', icon: 'egg', color: '#10B981', iconFamily: 'MaterialCommunityIcons' },
  { id: '6', name: 'Soy', icon: 'grain', color: '#7C3AED', iconFamily: 'MaterialCommunityIcons' },
  { id: '7', name: 'Medicines', icon: 'pill', color: '#DC2626', iconFamily: 'MaterialCommunityIcons' },
];

// Dummy allergen suggestions
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
          { backgroundColor: isSelected ? color : '#f5f5f7' }
        ]}
        onPress={() => updateAllergySeverity(itemId, severity)}
      >
        <Text style={{
          color: isSelected ? '#fff' : '#666',
          fontWeight: isSelected ? '600' : '400'
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
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Allergies</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Allergy</Text>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Type allergen name..."
              value={allergyText}
              onChangeText={handleAllergyTextChange}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addAllergy()}
            >
              <FontAwesome name="plus" size={18} color="#fff" />
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
                  <FontAwesome name="plus" size={14} color="#4C6EF5" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

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
                    { backgroundColor: category.color + '20' }
                  ]}
                >
                  {/* Render icon based on iconFamily */}
                  {category.iconFamily === 'FontAwesome' ? (
                    <FontAwesome name={category.icon} size={22} color={category.color} />
                  ) : (
                    <MaterialCommunityIcons name={category.icon} size={22} color={category.color} />
                  )}
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Allergies</Text>
          <View style={styles.allergiesList}>
            {userAllergies.map(allergy => (
              <View key={allergy.id} style={styles.allergyItem}>
                <View style={styles.allergyHeader}>
                  <Text style={styles.allergyName}>{allergy.name}</Text>
                  <TouchableOpacity onPress={() => removeAllergy(allergy.id)}>
                    <FontAwesome name="trash" size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.severityLabel}>Severity:</Text>
                <View style={styles.severityContainer}>
                  {renderSeverityButton(allergy.severity, allergy.id, 'Mild', '#38B2AC', 'Mild')}
                  {renderSeverityButton(allergy.severity, allergy.id, 'Moderate', '#F59E0B', 'Moderate')}
                  {renderSeverityButton(allergy.severity, allergy.id, 'Severe', '#DC2626', 'Severe')}
                </View>
              </View>
            ))}

            {userAllergies.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  You haven't added any allergies yet
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.infoBox}>
          <FontAwesome name="info-circle" size={18} color="#4C6EF5" />
          <Text style={styles.infoText}>
            Add your known allergies to receive alerts when scanning products with allergenic ingredients. 
            Setting the severity helps prioritize warnings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#111827',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#4C6EF5',
    padding: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  suggestionsContainer: {
    marginTop: 10,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    maxHeight: 160,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 15,
    color: '#374151',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  allergiesList: {
    gap: 16,
  },
  allergyItem: {
    backgroundColor: '#fef3f2',
    borderRadius: 12,
    padding: 15,
  },
  allergyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#9CA3AF',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#E0E7FF',
    borderRadius: 10,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    color: '#4338CA',
    fontSize: 14,
  },
});
