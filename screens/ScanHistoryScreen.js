import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

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

const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function ScanHistoryScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [history, setHistory] = useState(MOCK_HISTORY);
  
  const goBack = () => navigation.goBack();
  
  const filteredHistory = () => {
    if (!searchQuery && filter === 'all') return history;
    
    return history.map(day => {
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
      
      return filteredScans.length > 0 ? { ...day, scans: filteredScans } : null;
    }).filter(Boolean);
  };
  
  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  const clearHistory = () => {
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
  
  const totalScans = history.reduce((total, day) => total + day.scans.length, 0);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text);
              handleSearch();
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => {
                setSearchQuery('');
                handleSearch();
              }}
            >
              <MaterialIcons name="close" size={16} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Filter Chips */}
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
          <MaterialIcons 
            name="check" 
            size={16} 
            color={filter === 'safe' ? "white" : "#64748b"} 
          />
          <Text style={[styles.filterText, filter === 'safe' && styles.safeFilterText]}>
            Safe
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'unsafe' && styles.unsafeFilterChip]}
          onPress={() => setFilter('unsafe')}
        >
          <MaterialIcons 
            name="warning" 
            size={16} 
            color={filter === 'unsafe' ? "white" : "#64748b"} 
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
            <MaterialIcons name="delete-outline" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#041c33ff" />
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
                      { backgroundColor: scan.isSafe ? '#10B981' : '#EF4444' }
                    ]}>
                      <MaterialIcons 
                        name={scan.isSafe ? 'check' : 'warning'} 
                        size={16} 
                        color="white" 
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
                                { backgroundColor: scan.isSafe ? '#10B98120' : '#EF444420' }
                              ]}
                            >
                              <Text style={[
                                styles.allergenText,
                                { color: scan.isSafe ? '#10B981' : '#EF4444' }
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
                    <MaterialIcons name="chevron-right" size={20} color="#64748b" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          contentContainerStyle={styles.historyList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="history" size={50} color="#8e8e93" />
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
                <MaterialIcons name="photo-camera" size={20} color="#ffffff" />
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
    backgroundColor: '#ffffff',
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
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  searchInputContainer: {
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeFilterChip: {
    backgroundColor: '#041c33ff',
    borderColor: '#041c33ff',
  },
  safeFilterChip: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  unsafeFilterChip: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  filterText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  safeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  unsafeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  clearHistoryButton: {
    marginLeft: 'auto',
    padding: 8,
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
  historyList: {
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  dateSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041c33ff',
    marginBottom: 12,
  },
  scanItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f3f5',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scanItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  safetyIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
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
  allergensContainer: {
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
  scanItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanTime: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#041c33ff',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  scanButton: {
    backgroundColor: '#041c33ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
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
    marginLeft: 8,
  },
});