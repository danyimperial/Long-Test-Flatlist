import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert, // For user-facing error messages
  StyleSheet, // For the new placeholder styles
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, DrawerActions } from '@react-navigation/native';

import mainStyles from '../styles/MainStyle'; // Assuming this contains your existing styles
import BottomNav from './BottomNav'; // Assuming this is your Bottom Navigation component
import axios from 'axios';


const API_ENDPOINT = 'https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/Xchange';
const INITIAL_API_PARAMS = {
  categories: [],
  last_listing_id: '',
  last_row_value: '', // Keep this if your API uses it for specific pagination
  max: '',
  min: '',
  search: '',
  sort: '', // Expected to be 'price_asc', 'price_desc', or empty
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJuYmYiOjE3NDYxOTI1MTQsImV4cCI6MTc0ODc4NDUxNCwiaXNzIjoiWHVyMzRQMSIsImF1ZCI6Ilh1cjQ0UFAifQ.QD-fcLXtznCfkTIYkbOQfc5fXfxYgw_mOziKWpUHddk',
  user_type: 'Xpert',
  version_number: '2.2.6',
  limit: 10,
};





const HomeScreen = () => {

  
  const navigation = useNavigation();
  const route = useRoute();

  const [data, setData] = useState([]);
  const [apiParams, setApiParams] = useState(INITIAL_API_PARAMS);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(true); // To track if there's more data to load

const [fullData, setFullData] = useState([]);
 const [filters, setFilters] = useState({ category: '', minPrice: 0, maxPrice: Number.MAX_VALUE });


   useEffect(() => {
  if (route.params?.filters) {
    const { category, minPrice, maxPrice } = route.params.filters;

    setFilters({
      category: category || '',
      minPrice: parseFloat(minPrice) || 0,
      maxPrice: parseFloat(maxPrice) || Number.MAX_VALUE,
    });
  }
}, [route.params?.filters]);


useEffect(() => {
  const fetchItems = async () => {
    try {
      const response = await axios.get('https://your-api-endpoint.com/products');
      console.log('API response.data:', response.data);
      const allItems = response.data;
      setFullData(allItems);
    } catch (error) {
      console.error('Fetch error:', error);
      setFetchError(error.message || 'Failed to fetch');
    }
  };
  fetchItems();
}, []);


useEffect(() => {
  if (!Array.isArray(fullData)) {
    // Defensive: if fullData is not an array, skip filtering
    setData([]);
    return;
  }

  const filtered = fullData.filter((item) => {
    const price = parseFloat(item.selling_price);
    const matchesCategory = filters.category === '' || item.category === filters.category;
    const matchesPrice = !isNaN(price) && price >= filters.minPrice && price <= filters.maxPrice;
    return matchesCategory && matchesPrice;
  });

  setData(filtered);
}, [filters, fullData]);




  // --- Data Fetching Logic ---
  const fetchData = useCallback(
    async (currentParams, isInitialOrRefresh = false) => {
      if (isLoading) {
        console.log('Fetch aborted: already loading.');
        return; // Prevent multiple concurrent fetches
      }
      if (!hasMoreData && !isInitialOrRefresh) {
          console.log('No more data to load.');
          return; // Prevent fetching if already reached the end on pagination
      }

      console.log('Fetching with params:', JSON.stringify(currentParams, null, 2)); // Detailed logging

      setIsLoading(true);
      setFetchError(null); // Clear previous errors

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentParams),
        });

        // Always try to read response as text first for better debugging,
        // especially when API sends non-JSON errors.
        const responseText = await response.text();

        if (!response.ok) {
          console.error('API Error Response (raw text):', responseText);
          throw new Error(`HTTP error ${response.status}: ${responseText}`);
        }

        let json;
        try {
          json = JSON.parse(responseText); // Attempt to parse as JSON
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error(`Invalid JSON response from API: ${responseText.substring(0, 100)}...`);
        }

        const newItems = json?.xchange || [];
        console.log(`Received ${newItems.length} items from API.`);

        setData(prevData => {
          if (isInitialOrRefresh) {
            return newItems; // Replace data on initial load or refresh
          } else {
            const uniqueNewItems = newItems.filter(
                newItem => !prevData.some(existingItem => existingItem.listing_id === newItem.listing_id)
            );
            return [...prevData, ...uniqueNewItems];
          }
        });

        if (newItems.length > 0) {
          const lastId = String(newItems[newItems.length - 1].listing_id);
          if (lastId !== currentParams.last_listing_id) {
            setApiParams(prev => ({
              ...prev,
              last_listing_id: lastId,
              // Update last_row_value if your API uses it for pagination
              // last_row_value: String(newItems[newItems.length - 1].some_other_value)
            }));
          }
          setHasMoreData(newItems.length === currentParams.limit); // More data if we got 'limit' items
        } else {
          setHasMoreData(false); // No more data to load
        }

      } catch (err) {
        console.error('Fetch operation failed:', err);
        setFetchError(err.message || 'An unexpected error occurred.');
        Alert.alert('Error', err.message || 'Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [isLoading, hasMoreData] // Depend on these states to control flow
  );

  // --- Effect for Route Params (Drawer Filters) ---
useEffect(() => {
  if (route.params && Object.keys(route.params).length > 0) {
    const { category, min, max, sort } = route.params;

    const updatedParams = {
      ...INITIAL_API_PARAMS,
      token: apiParams.token,
      user_type: apiParams.user_type,
      version_number: apiParams.version_number,
      limit: apiParams.limit,
      search: searchText,
      categories: category && category !== 'default' ? [category] : [],
      min: min ? String(min) : '',
      max: max ? String(max) : '',
      sort: sort || '',
      last_listing_id: '',
      last_row_value: '',
    };

    // 💡 Only update if params actually changed
    setApiParams(prev => {
      const prevString = JSON.stringify(prev);
      const nextString = JSON.stringify(updatedParams);
      if (prevString !== nextString) return updatedParams;
      return prev;
    });

    setData([]);
    setHasMoreData(true);
  }
}, [route.params, searchText]);

  useEffect(() => {

    fetchData(apiParams, apiParams.last_listing_id === ''); // `true` for initial/new filter fetch
  }, [apiParams, fetchData]);

  const handleSearchChange = text => setSearchText(text);

  const submitSearch = () => {
    setApiParams(prev => ({
      ...INITIAL_API_PARAMS, 
      token: prev.token,
      user_type: prev.user_type,
      version_number: prev.version_number,
      limit: prev.limit,

      search: searchText, 
      categories: prev.categories, 
      sort: prev.sort,
      min: prev.min, 
      max: prev.max, 
      last_listing_id: '',
      last_row_value: '',
    }));
    setData([]); // Clear current data
    setHasMoreData(true); // Assume there's more data for a new search
  };

  // --- Pull-to-refresh Handler ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    setApiParams(prev => ({
      ...INITIAL_API_PARAMS, // Start fresh
      token: prev.token,
      user_type: prev.user_type,
      version_number: prev.version_number,
      limit: prev.limit,

      search: searchText, // Retain current search text
      categories: prev.categories, // Retain existing category filter
      sort: prev.sort, // Retain existing sort order
      min: prev.min, // Retain existing min price
      max: prev.max, // Retain existing max price

      // Reset pagination
      last_listing_id: '',
      last_row_value: '',
    }));
    setData([]); // Clear data to show fresh results
    setHasMoreData(true); // Assume there's more data for refresh
  };

  // --- Pagination: Load More Data ---
const handleLoadMore = () => {
  if (!isLoading && data.length > 0 && hasMoreData) {
    console.log('Attempting to load more...');
    fetchData(apiParams, false); // Trigger fetch for next batch (pagination)
  }
};

const SkeletonItem = () => (
  <View style={[mainStyles.item, { opacity: 0.5 }]}>
    <View style={[mainStyles.imageContainer, { backgroundColor: '#ccc' }]} />
    <View style={{ height: 20, backgroundColor: '#ddd', marginTop: 8, borderRadius: 4 }} />
    <View style={{ height: 14, width: '60%', backgroundColor: '#eee', marginTop: 4, borderRadius: 4 }} />
    <View style={{ height: 20, backgroundColor: '#ddd', marginTop: 8, borderRadius: 4 }} />
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#ccc' }} />
      <View style={{ height: 14, width: '50%', backgroundColor: '#eee', marginLeft: 8, borderRadius: 4 }} />
    </View>
  </View>
);


  // --- Render Item for FlatList ---
const renderItem = ({ item }) => {
  if (!item || typeof item !== 'object') return null;

  const {
    item_image,
    model = 'Unknown Model',
    category = 'Unknown Category',
    selling_price,
    lister_image,
    lister_name = 'Unknown Lister',
  } = item;

  return (
    <View style={mainStyles.item}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetailScreen', { item })}
        style={mainStyles.itemTouchable}
        activeOpacity={0.8}
      >
        <View style={mainStyles.imageContainer}>
          {item_image ? (
            <Image
              source={{ uri: item_image }}
              style={mainStyles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Text style={styles.noImageText}>No Image</Text>
            </View>
          )}
        </View>

        <View style={mainStyles.titleCategoryRow}>
          <Text style={mainStyles.title} numberOfLines={1} ellipsizeMode="tail">
            {model}
          </Text>
          <Text style={mainStyles.category}>
            {category}
          </Text>
        </View>

        <Text style={mainStyles.price}>
          {selling_price != null ? `HKD ${selling_price}.00` : 'Price not available'}
        </Text>

        <View style={mainStyles.listerInfo}>
          {lister_image ? (
            <Image
              source={{ uri: lister_image }}
              style={mainStyles.listerImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person-circle" size={24} color="#555" style={styles.listerImagePlaceholder} />
          )}
          <Text style={mainStyles.listerName}>
            {lister_name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

  // --- Key Extractor for FlatList ---
  const keyExtractor = item => String(item.listing_id || Math.random()); // Ensure unique string key

  // --- Main Component Render ---
  return (
    <View style={mainStyles.container}>
      {/* Error display */}
      {fetchError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {fetchError}</Text>
          <TouchableOpacity onPress={() => handleRefresh()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Header Section */}
      <View style={mainStyles.header}>
        {/* <Image
          source={require('../assets/cute.png')}
          style={mainStyles.headerImage}
        /> */}
        <View style={mainStyles.overlay}>
          {/* <Image
            source={require('../assets/popmartlogo.png')}
            style={mainStyles.logo}
          /> */}
          <Text  style={mainStyles.logo}>The Xchange</Text>
          <Ionicons
            name="notifications-outline"
            size={24}
            color="white"
            style={mainStyles.bellIcon}
          />
        </View>
        {/* <View style={mainStyles.headerTextContainer}>
          <Text style={mainStyles.headerText}>New Release</Text>
          <Text style={mainStyles.headerText1}>DIMOO</Text>
        </View> */}
      </View>

      {/* Search Bar */}
      <View style={mainStyles.searchBar}>
        {/* <Ionicons name="search" size={20} color="#000" /> */}
        <TextInput
          style={mainStyles.searchInput}
          placeholder="Tell us what you're looking for"
          value={searchText}
          onChangeText={handleSearchChange}
          onSubmitEditing={submitSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Daily Discovery Label & Filter Icon */}
      <View style={mainStyles.labelRow}>
        <Text style={mainStyles.label}>Daily Discovery</Text>
        <Ionicons
          name="filter"
          size={24}
          color="#000"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    style={{ padding: 8 }} // Adjust -5 to whatever value looks good
        />
      </View>

      {/* Main Product List */}
      {isLoading && data.length === 0 ? (
  <FlatList
    data={Array(apiParams.limit).fill(0)} // Show placeholders equal to page size
    keyExtractor={(_, index) => `skeleton-${index}`}
    renderItem={() => <SkeletonItem />}
    numColumns={2}
    scrollEnabled={false} // Optional: disable scroll on skeleton
    style={mainStyles.arrivalsList}
        contentContainerStyle={mainStyles.flatListContentContainer} // <-- ADD THIS

  />
) : (
  <FlatList
    data={data}
    keyExtractor={keyExtractor}
    renderItem={renderItem}
    onEndReached={handleLoadMore}
    onEndReachedThreshold={0.5}
    numColumns={2}
    refreshControl={
      <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
    }
    ListFooterComponent={
      isLoading && data.length > 0 ? (
        <View style={mainStyles.loaderContainer}>
          <ActivityIndicator size="large" color="#ac895c" />
        </View>
      ) : null
    }
    style={mainStyles.arrivalsList}
    // ListEmptyComponent={
    //   !isLoading && data.length === 0 && !fetchError ? (
    //     <View style={styles.emptyListContainer}>
    //       <Text style={styles.emptyListText}>No products found matching your criteria.</Text>
    //     </View>
    //   ) : null
    // }
  />
)}
      <BottomNav />
    </View>
  );
};

// New styles for placeholders and error display
const styles = StyleSheet.create({
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, // Match mainStyles.image border-radius if present
  },
  noImageText: {
    color: '#888',
    fontSize: 14,
  },
  listerImagePlaceholder: {
    // Inherits default Ionicons size/color, adjust if needed
    marginRight: 5,
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Take full height if possible
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ffebee', // Light red background
    borderBottomWidth: 1,
    borderColor: '#ef9a9a', // Darker red border
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  errorText: {
    color: '#d32f2f', // Dark red text
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 15,
  },
  retryButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;