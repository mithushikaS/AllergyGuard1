import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function ProductResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    productName,
    brand,
    ingredients = [],
    allergensFound = [],
    isSafe,
    image
  } = route.params || {};
  
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const shareResult = () => {
    // In a real app, we would integrate with the Share API
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Sharing functionality coming soon'
    });
  };

  const contactExpert = () => {
    navigation.navigate('ExpertHelp');
  };

  const renderIngredientsList = () => {
    const visibleIngredients = showAllIngredients ? ingredients : ingredients.slice(0, 3);
    
    return (
      <View style={styles.ingredientsContainer}>
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {visibleIngredients.map((ingredient, index) => {
          const containsAllergen = allergensFound.some(allergen => 
            ingredient.toLowerCase().includes(allergen.toLowerCase())
          );
          
          return (
            <View 
              key={index}
              style={[
                styles.ingredientItem,
                containsAllergen && styles.allergenHighlight
              ]}
            >
              <Text 
                style={[
                  styles.ingredientText,
                  containsAllergen && styles.allergenText
                ]}
              >
                {ingredient}
                {containsAllergen && (
                  <Text style={styles.allergenWarning}> (Allergen)</Text>
                )}
              </Text>
            </View>
          );
        })}
        
        {ingredients.length > 3 && (
          <TouchableOpacity
            onPress={() => setShowAllIngredients(!showAllIngredients)}
            style={styles.showMoreButton}
          >
            <Text style={styles.showMoreText}>
              {showAllIngredients ? 'Show Less' : `Show All (${ingredients.length} ingredients)`}
            </Text>
            <FontAwesome 
              name={showAllIngredients ? 'chevron-up' : 'chevron-down'} 
              size={14} 
              color="#4C6EF5" 
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Analysis</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareResult}>
          <FontAwesome name="share-alt" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.productHeader}>
          <Image 
            source={{ uri: image || `https://api.a0.dev/assets/image?text=${encodeURIComponent(productName)}&aspect=4:3` }}
            style={styles.productImage}
          />
          
          <View style={styles.safetyBanner} backgroundColor={isSafe ? '#10b981' : '#DC2626'}>
            <FontAwesome 
              name={isSafe ? 'check-circle' : 'exclamation-triangle'} 
              size={24} 
              color="#ffffff" 
              style={styles.safetyIcon}
            />
            <Text style={styles.safetyText}>
              {isSafe 
                ? 'This product should be safe for you' 
                : 'This product contains allergens you may be sensitive to'}
            </Text>
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{productName}</Text>
          {brand && <Text style={styles.productBrand}>{brand}</Text>}
          
          {allergensFound.length > 0 && (
            <View style={styles.allergensFoundContainer}>
              <Text style={styles.sectionTitle}>
                Allergens Found:
              </Text>
              <View style={styles.allergenTagsContainer}>
                {allergensFound.map((allergen, index) => (
                  <View 
                    key={index} 
                    style={styles.allergenTag}
                  >
                    <FontAwesome name="exclamation-circle" size={14} color="#DC2626" style={styles.allergenIcon} />
                    <Text style={styles.allergenTagText}>{allergen}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {renderIngredientsList()}

          <View style={styles.actionButtonsContainer}>
            {!isSafe && (
              <TouchableOpacity 
                style={styles.expertAdviceButton}
                onPress={contactExpert}
              >
                <FontAwesome name="user-md" size={20} color="#ffffff" />
                <Text style={styles.expertAdviceButtonText}>Get Expert Advice</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.alternativesButton}>
              <FontAwesome name="list-alt" size={20} color="#ffffff" />
              <Text style={styles.alternativesButtonText}>Find Safe Alternatives</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>About Allergen Detection</Text>
            <Text style={styles.infoText}>
              Our system detects common allergens in ingredients lists. However, cross-contamination 
              risks or manufacturing processes may not be fully reflected. Always consult a healthcare 
              professional if you have severe allergies.
            </Text>
          </View>
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
  shareButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  productHeader: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 220,
  },
  safetyBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyIcon: {
    marginRight: 10,
  },
  safetyText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
  },
  productBrand: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  allergensFoundContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  allergenTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenTag: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  allergenIcon: {
    marginRight: 6,
  },
  allergenTagText: {
    color: '#b91c1c',
    fontWeight: '500',
    fontSize: 14,
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  ingredientItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'transparent',
  },
  allergenHighlight: {
    backgroundColor: '#fff1f2',
    borderRadius: 6,
    marginBottom: 3,
    borderBottomWidth: 0,
  },
  ingredientText: {
    fontSize: 15,
    color: '#334155',
  },
  allergenText: {
    fontWeight: '500',
    color: '#b91c1c',
  },
  allergenWarning: {
    fontWeight: '600',
    color: '#b91c1c',
    fontStyle: 'italic',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  showMoreText: {
    color: '#4C6EF5',
    marginRight: 5,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    marginBottom: 20,
  },
  expertAdviceButton: {
    backgroundColor: '#4C6EF5',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  expertAdviceButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  alternativesButton: {
    backgroundColor: '#38B2AC',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alternativesButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  infoText: {
    color: '#3b82f6',
    lineHeight: 20,
    fontSize: 14,
  },
});