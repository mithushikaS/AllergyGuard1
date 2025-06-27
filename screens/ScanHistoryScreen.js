import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Mock data for scan history
const MOCK_HISTORY = [
  {
    date: '2023-06-08',
    scans: [
      {
        id: '1',
        productName: 'Chocolate Chip Cookies',
        brand: 'Sweet Treats',
        time: '14:30',
        isSafe: false,
        allergens: ['Wheat (Gluten)', 'Eggs', 'Soy']
      },
      {
        id: '2',
        productName: 'Almond Milk',
        brand: 'NutriPlant',
        time: '10:15',
        isSafe: true,
        allergens: ['Tree Nuts (Almonds)']
      }
    ]
  },
  {
    date: '2023-06-07',
    scans: [
      {
        id: '3',
        productName: 'Chicken Noodle Soup',
        brand: 'HomeStyle',
        time: '19:45',
        isSafe: true,
        allergens: ['Wheat (Gluten)']
      }
    ]
  },
  {
    date: '2023-06-05',
    scans: [
      {
        id: '4',
        productName: 'Peanut Butter',
        brand: 'NutLover',
        time: '08:20',
        isSafe: false,
        allergens: ['Peanuts']
      },
      {
        id: '5',
        productName: 'Orange Juice',
        brand: 'FreshSqueeze',
        time: '12:10',
        isSafe: true,
        allergens: []
      },
      {
        id: '6',
        productName: 'Oat Cereal',
        brand: 'MorningStar',
        time: '07:30',
        isSafe: true,
        allergens: ['Oats']
      }
    ]
  }
];

// Function to format date for display
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function ScanHistoryScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'safe', 'unsafe'
  const [history, setHistory] = useState(MOCK_HISTORY);
  
  const goBack = () => {
    navigation.goBack();
  };
  
  // Filter history based on search query and filter type
  const filteredHistory = () => {
    if (!searchQuery && filter === 'all') return history;
    
    return history.map(day => {
      // Filter scans based on search and safety filter
      const filteredScans = day.scans.filter(scan => {
        const matchesSearch = searchQuery ? 
          scan.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          scan.brand.toLowerCase().includes(searchQuery.toLowerCase()) : 
          true;
          
        const matchesFilter = filter === 'all' ? 
          true : 
          (filter === 'safe' ? scan.isSafe : !scan.isSafe);
          
        return matchesSearch && matchesFilter;
      });
      
      // Only return days that have scans after filtering
      return filteredScans.length > 0 ? { ...day, scans: filteredScans } : null;
    }).filter(Boolean); // Remove null entries
  };
  
  const handleSearch = () => {
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  const clearHistory = () => {
    // Show confirmation dialog
    Toast.show({
      type: 'info',
      text1: 'Clear History',
      text2: 'Do you want to clear all scan history?',
      position: 'bottom',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
      onPress: () => {
        setHistory([]);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Scan history cleared'
        });
      }
    });
  };
  
  const handleViewProductDetails = (product) => {
    navigation.navigate('ProductResult', {
      name: product.productName,
      brand: product.brand,
      allergensFound: product.allergens,
      isSafe: product.isSafe,
      image: `https://api.a0.dev/assets/image?text=${encodeURIComponent(product.productName)}&aspect=4:3`
    });
  };
  
  // Get total number of scans
  const totalScans = history.reduce((total, day) => total + day.scans.length, 0);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan History</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text);
              handleSearch();
            }}
            placeholderTextColor="#64748b"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => {
                setSearchQuery('');
                handleSearch();
              }}
            >
              <FontAwesome name="times-circle" size={16} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'all' && styles.activeFilterChip]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All ({totalScans})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'safe' && styles.safeFilterChip]}
          onPress={() => setFilter('safe')}
        >
          <FontAwesome 
            name="check" 
            size={12} 
            color={filter === 'safe' ? "#ffffff" : "#10b981"} 
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, filter === 'safe' && styles.safeFilterText]}>
            Safe
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'unsafe' && styles.unsafeFilterChip]}
          onPress={() => setFilter('unsafe')}
        >
          <FontAwesome 
            name="exclamation" 
            size={12} 
            color={filter === 'unsafe' ? "#ffffff" : "#ef4444"} 
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, filter === 'unsafe' && styles.unsafeFilterText]}>
            Unsafe
          </Text>
        </TouchableOpacity>
        
        {history.length > 0 && (
          <TouchableOpacity 
            style={styles.clearHistoryButton}
            onPress={clearHistory}
          >
            <FontAwesome name="trash" size={14} color="#64748b" />
            <Text style={styles.clearHistoryText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4C6EF5" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : filteredHistory().length > 0 ? (
        <FlatList
          data={filteredHistory()}
          keyExtractor={item => item.date}
          renderItem={({ item }) => (
            <View style={styles.dateSection}>
              <Text style={styles.dateHeader}>{formatDate(item.date)}</Text>
              {item.scans.map(scan => (
                <TouchableOpacity 
                  key={scan.id}
                  style={styles.scanItem}
                  onPress={() => handleViewProductDetails(scan)}
                >
                  <View style={styles.scanItemLeft}>
                    <View style={[
                      styles.safetyIndicator, 
                      { backgroundColor: scan.isSafe ? '#10b981' : '#ef4444' }
                    ]}>
                      <FontAwesome 
                        name={scan.isSafe ? 'check' : 'exclamation'} 
                        size={12} 
                        color="#ffffff" 
                      />
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{scan.productName}</Text>
                      <Text style={styles.productBrand}>{scan.brand}</Text>
                      {scan.allergens.length > 0 && (
                        <View style={styles.allergensContainer}>
                          {scan.allergens.map((allergen, i) => (
                            <View 
                              key={i} 
                              style={[
                                styles.allergenTag,
                                { backgroundColor: scan.isSafe ? '#dcfce7' : '#fee2e2' }
                              ]}
                            >
                              <Text style={[
                                styles.allergenText,
                                { color: scan.isSafe ? '#166534' : '#b91c1c' }
                              ]}>
                                {allergen}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.scanItemRight}>
                    <Text style={styles.scanTime}>{scan.time}</Text>
                    <FontAwesome name="chevron-right" size={14} color="#94a3b8" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          contentContainerStyle={styles.historyList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="history" size={50} color="#94a3b8" />
          {history.length === 0 ? (
            <>
              <Text style={styles.emptyTitle}>No scan history</Text>
              <Text style={styles.emptySubtitle}>
                Products you scan will appear here
              </Text>
              <TouchableOpacity 
                style={styles.scanButton}
                onPress={() => navigation.navigate('ScanProduct')}
              >
                <FontAwesome name="camera" size={18} color="#ffffff" />
                <Text style={styles.scanButtonText}>Scan a Product</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.emptyTitle}>No matching results</Text>
              <Text style={styles.emptySubtitle}>
                Try changing your search or filter
              </Text>
            </>
          )}
        </View>
      )}
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
    padding: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 16,
    color: '#0f172a',
  },
  clearButton: {
    padding: 6,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#4C6EF5',
  },
  safeFilterChip: {
    backgroundColor: '#10b981',
  },
  unsafeFilterChip: {
    backgroundColor: '#ef4444',
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeFilterText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  safeFilterText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  unsafeFilterText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  clearHistoryButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearHistoryText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#64748b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4C6EF5',
  },
  historyList: {
    paddingBottom: 20,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  scanItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  scanItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  safetyIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 2,
  },
  productBrand: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
  },
  allergensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  allergenText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scanItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanTime: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  scanButton: {
    backgroundColor: '#4C6EF5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  scanButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});