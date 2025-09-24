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
  const [imageError, setImageError] = useState(false);

  console.log('Received image URI:', image); // Debug log

  const goBack = () => {
    navigation.goBack();
  };

  const shareResult = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Sharing functionality coming soon'
    });
  };

  const contactExpert = () => {
    navigation.navigate('ExpertHelp');
  };

  const findAlternatives = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Alternative products feature coming soon'
    });
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
              color="#041c33ff" 
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
          <FontAwesome name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Analysis</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareResult}>
          <FontAwesome name="share-alt" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productHeader}>
          <Image 
            source={{ 
              uri: imageError || !image 
                ? `https://api.a0.dev/assets/image?text=${encodeURIComponent(productName || 'Product')}&aspect=4:3`
                : image 
            }}
            style={styles.productImage}
            onError={() => {
              console.log('Image load error, using fallback');
              setImageError(true);
            }}
            resizeMode="cover"
          />
          
          <View style={[
            styles.safetyBanner,
            { backgroundColor: isSafe ? '#10B981' : '#EF4444' }
          ]}>
            <FontAwesome 
              name={isSafe ? 'check-circle' : 'exclamation-triangle'} 
              size={20} 
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
          <Text style={styles.productName}>{productName || 'Unknown Product'}</Text>
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
                    <FontAwesome name="exclamation-circle" size={14} color="#EF4444" style={styles.allergenIcon} />
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
                <FontAwesome name="user-md" size={18} color="#ffffff" />
                <Text style={styles.expertAdviceButtonText}>Get Expert Advice</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.alternativesButton}
              onPress={findAlternatives}
            >
              <FontAwesome name="list-alt" size={18} color="#ffffff" />
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
      
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  productHeader: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 240,
  },
  safetyBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  safetyIcon: {
    marginRight: 12,
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
    fontWeight: '700',
    color: '#041c33ff',
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  allergensFoundContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#041c33ff',
    marginBottom: 12,
  },
  allergenTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenTag: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  allergenIcon: {
    marginRight: 8,
  },
  allergenTagText: {
    color: '#B91C1C',
    fontWeight: '500',
    fontSize: 14,
  },
  ingredientsContainer: {
    marginBottom: 24,
  },
  ingredientItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    backgroundColor: 'transparent',
  },
  allergenHighlight: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginBottom: 8,
    borderBottomWidth: 0,
  },
  ingredientText: {
    fontSize: 15,
    color: '#041c33ff',
  },
  allergenText: {
    fontWeight: '500',
    color: '#B91C1C',
  },
  allergenWarning: {
    fontWeight: '600',
    color: '#B91C1C',
    fontStyle: 'italic',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  showMoreText: {
    color: '#041c33ff',
    marginRight: 8,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  expertAdviceButton: {
    backgroundColor: '#041c33ff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#041c33ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  expertAdviceButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 12,
  },
  alternativesButton: {
    backgroundColor: '#052a4cff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#052a4cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  alternativesButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 12,
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#041c33ff',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041c33ff',
    marginBottom: 8,
  },
  infoText: {
    color: '#041c33ff',
    lineHeight: 20,
    fontSize: 14,
  },
});