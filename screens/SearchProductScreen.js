import { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

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

  const goBack = () => navigation.goBack();

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
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Product</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter product name or brand..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSearchQuery('')}
            >
              <MaterialIcons name="close" size={16} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
        >
          <MaterialIcons name="search" size={20} color="#041c33ff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#041c33ff" />
          <Text style={styles.loadingText}>Searching products...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Search Results</Text>
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.productItem}
                onPress={() => handleProductSelect(item)}
              >
                <View style={styles.productLeft}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productBrand}>{item.brand}</Text>
                  <View style={styles.allergenContainer}>
                    {item.allergensFound.map((allergen, index) => (
                      <View 
                        key={index} 
                        style={[
                          styles.allergenTag,
                          { backgroundColor: item.isSafe ? '#10B98120' : '#EF444420' }
                        ]}
                      >
                        <Text 
                          style={[
                            styles.allergenText,
                            { color: item.isSafe ? '#10B981' : '#EF4444' }
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
                  { backgroundColor: item.isSafe ? '#10B981' : '#EF4444' }
                ]}>
                  <MaterialIcons 
                    name={item.isSafe ? 'check' : 'warning'} 
                    size={16} 
                    color="white" 
                  />
                  <Text style={styles.safetyText}>
                    {item.isSafe ? 'Safe' : 'Unsafe'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.resultsList}
          />
        </View>
      ) : searchQuery.length > 0 ? (
        <View style={styles.emptyResultsContainer}>
          <MaterialIcons name="search-off" size={50} color="#8e8e93" />
          <Text style={styles.emptyResultsText}>No products found</Text>
          <Text style={styles.emptyResultsSubText}>
            Try a different search term or scan the product
          </Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => navigation.navigate('ScanProduct')}
          >
            <MaterialIcons name="photo-camera" size={20} color="#041c33ff" />
            <Text style={styles.scanButtonText}>Scan Product Instead</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="search" size={50} color="#8e8e93" />
          <Text style={styles.emptyStateText}>Search for products</Text>
          <Text style={styles.emptyStateSubText}>
            Enter a product name or brand to check for allergens
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#041c33ff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#041c33ff',
    fontSize: 16,
  },
  clearButton: {
    padding: 6,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#041c33ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#041c33ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#041c33ff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#041c33ff',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productLeft: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041c33ff',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  allergenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  allergenText: {
    fontSize: 12,
    fontWeight: '500',
  },
  safetyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  safetyText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 13,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#041c33ff',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  suggestionContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041c33ff',
    marginBottom: 12,
    textAlign: 'center',
  },
  suggestionChips: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  suggestionChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  suggestionChipText: {
    color: '#041c33ff',
    fontWeight: '500',
  },
  emptyResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  emptyResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#041c33ff',
    marginTop: 16,
  },
  emptyResultsSubText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: '#041c33ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#041c33ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsList: {
    paddingBottom: 16,
  },
});