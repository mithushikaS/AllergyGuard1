import { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Mock data for product searches
const MOCK_PRODUCTS = [
  { 
    id: '1', 
    name: 'Chocolate Chip Cookies', 
    brand: 'Sweet Treats',
    ingredients: [
      'Wheat Flour', 'Sugar', 'Chocolate Chips (Cocoa Mass, Sugar, Cocoa Butter, Emulsifier: Soy Lecithin)', 
      'Vegetable Oil (Palm, Rapeseed)', 'Eggs', 'Salt', 'Raising Agent (Sodium Bicarbonate)'
    ],
    allergensFound: ['Wheat (Gluten)', 'Eggs', 'Soy'],
    isSafe: false,
  },
  { 
    id: '2', 
    name: 'Almond Milk', 
    brand: 'NutriPlant',
    ingredients: [
      'Water', 'Almonds (2%)', 'Calcium Carbonate', 'Sea Salt', 'Stabilizer (Gellan Gum)', 
      'Vitamins (D2, B12)', 'Natural Flavor'
    ],
    allergensFound: ['Tree Nuts (Almonds)'],
    isSafe: true,
  },
  { 
    id: '3', 
    name: 'Chicken Noodle Soup', 
    brand: 'HomeStyle',
    ingredients: [
      'Water', 'Chicken', 'Wheat Noodles', 'Carrots', 'Celery', 'Onions', 
      'Chicken Broth', 'Salt', 'Spices', 'Yeast Extract'
    ],
    allergensFound: ['Wheat (Gluten)'],
    isSafe: true,
  }
];

export default function SearchProductScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const goBack = () => {
    navigation.goBack();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a product name'
      });
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      const results = MOCK_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(results);
      setIsSearching(false);

      if (results.length === 0) {
        Toast.show({
          type: 'error',
          text1: 'No Results',
          text2: 'No products found. Try a different search term.'
        });
      }
    }, 1000);
  };

  const handleProductSelect = (product) => {
    navigation.navigate('ProductResult', {
      ...product,
      image: `https://api.a0.dev/assets/image?text=${encodeURIComponent(product.name)}&aspect=4:3`
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter product name or brand..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#64748b"
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSearchQuery('')}
            >
              <FontAwesome name="times-circle" size={16} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4C6EF5" />
            <Text style={styles.loadingText}>Searching products...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <>
            <Text style={styles.resultsTitle}>Search Results</Text>
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.productItem}
                  onPress={() => handleProductSelect(item)}
                >
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productBrand}>{item.brand}</Text>
                    <View style={styles.allergenContainer}>
                      <Text style={styles.allergenLabel}>Contains: </Text>
                      {item.allergensFound.map((allergen, index) => (
                        <View 
                          key={index} 
                          style={[
                            styles.allergenTag,
                            { backgroundColor: item.isSafe ? '#dcfce7' : '#fee2e2' }
                          ]}
                        >
                          <Text 
                            style={[
                              styles.allergenText,
                              { color: item.isSafe ? '#166534' : '#b91c1c' }
                            ]}
                          >
                            {allergen}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={[
                    styles.safetyIndicator,
                    { backgroundColor: item.isSafe ? '#10b981' : '#DC2626' }
                  ]}>
                    <FontAwesome 
                      name={item.isSafe ? 'check' : 'exclamation'} 
                      size={14} 
                      color="#ffffff" 
                    />
                    <Text style={styles.safetyText}>
                      {item.isSafe ? 'Safe' : 'Unsafe'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.resultsList}
            />
          </>
        ) : searchQuery.length > 0 ? (
          <View style={styles.emptyResultsContainer}>
            <FontAwesome name="search" size={50} color="#94a3b8" />
            <Text style={styles.emptyResultsText}>No products found</Text>
            <Text style={styles.emptyResultsSubText}>Try a different search term or scan the product</Text>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => navigation.navigate('ScanProduct')}
            >
              <FontAwesome name="camera" size={18} color="#ffffff" />
              <Text style={styles.scanButtonText}>Scan Product Instead</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <FontAwesome name="search" size={50} color="#94a3b8" />
            <Text style={styles.emptyStateText}>Search for products</Text>
            <Text style={styles.emptyStateSubText}>
              Enter a product name or brand to check if it contains allergens
            </Text>

            <View style={styles.suggestionContainer}>
              <Text style={styles.suggestionTitle}>Try searching for:</Text>
              <View style={styles.suggestionChips}>
                <TouchableOpacity 
                  style={styles.suggestionChip}
                  onPress={() => setSearchQuery('Cookies')}
                >
                  <Text style={styles.suggestionChipText}>Cookies</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.suggestionChip}
                  onPress={() => setSearchQuery('Milk')}
                >
                  <Text style={styles.suggestionChipText}>Milk</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.suggestionChip}
                  onPress={() => setSearchQuery('Chocolate')}
                >
                  <Text style={styles.suggestionChipText}>Chocolate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
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
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1e293b',
  },
  clearButton: {
    paddingHorizontal: 6,
  },
  searchButton: {
    backgroundColor: '#4C6EF5',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#334155',
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#64748b',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
  productBrand: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  allergenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenLabel: {
    fontWeight: '600',
    color: '#334155',
  },
  allergenTag: {
    marginRight: 6,
    marginBottom: 4,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  allergenText: {
    fontSize: 12,
    fontWeight: '600',
  },
  safetyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
  },
  safetyText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 13,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '700',
    color: '#94a3b8',
  },
  emptyStateSubText: {
    marginTop: 10,
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  suggestionContainer: {
    marginTop: 30,
    width: '100%',
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  suggestionChips: {
    flexDirection: 'row',
    gap: 12,
  },
  suggestionChip: {
    backgroundColor: '#4C6EF5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestionChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyResultsText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 10,
  },
  emptyResultsSubText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    marginBottom: 20,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: '#4C6EF5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    gap: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsList: {
    paddingBottom: 20,
  },
});
