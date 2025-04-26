import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, RefreshControl } from 'react-native';

const endpoint = 'https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/Xchange';
const initialParams = {
  "categories": [],
  "last_listing_id": "",
  "last_row_value": "",
  "max": "",
  "min": "",
  "search": "",
  "sort": "",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYiLCJuYmYiOjE3NDU2MjYzNTksImexpcCI6MTc0ODIxODM1OSwiaXNzIjoiWHVyMzRQMSIsImF1ZCI6Ilh1cjQ0UFAifQ.qzc-LBSyxuBd7RqMtQFovUo093KtW3p7xHaYUPe0WJ8",
  "user_type": "Xpert",
  "version_number": "2.2.6",
  "limit": 10
};

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }

      const json = await response.json();
      console.log('API Response:', json);
      setData(prevData => [...prevData, ...json.xchange]);
    } catch (e) {
      console.error('Fetch Error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setData([]);
    setParams(initialParams);
    fetchData();
  }, [fetchData]);

  const handleLoadMore = useCallback(() => {
    if (!loading && data.length > 0 && data[data.length - 1]?.listing_id) {
      setParams(prevParams => ({
        ...prevParams,
        last_listing_id: data[data.length - 1].listing_id.toString(),
      }));
      fetchData();
    }
  }, [data, loading, fetchData]);

  const renderItem = useCallback(({ item }) => (
    <View style={styles.item}>
      <View style={styles.imageContainer}>
        {item.item_image && (
          <Image
            source={{ uri: item.item_image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{item.model || item.productName}</Text>
      <Text style={styles.price}>${item.selling_price || item.cost}</Text>
      <Text style={styles.category}>Category: {item.c}</Text>
    </View>
  ), []);

  const renderItemSeries = useCallback(({ item }) => (
    <View style={styles.item1}>
      <View style={styles.imageContainer1}>
        {item.item_image && (
          <Image
            source={{ uri: item.item_image }}
            style={styles.image1}
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  ), []);

  const renderFooter = useCallback(() => (
    loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    ) : null
  ), [loading]);

  const keyExtractor = useCallback((item) => item.listing_id ? item.listing_id.toString() : Math.random().toString(), []);

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      <View style={styles.header}>
        <Image source={require('./src/assets/pop.jpg')} style={styles.headerImage} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Your Text</Text>
        </View>
      </View>
      <Text style={styles.label}>Daily Discovery</Text>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={styles.arrivalsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0, // Remove container padding to allow header to go to edges
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 250, // Adjust as needed
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  headerImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerTextContainer: {
    position: 'absolute',
    top: 100, // Align to the very top
    left: 10, // 10-pixel padding from the left
    padding: 10, // Optional padding for the text background
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional semi-transparent background
    borderRadius: 5, // Optional text background rounded corners
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  seriesContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontFamily: 'sans-serif-medium',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10, // Add some top margin to separate from the header
    paddingHorizontal: 10, // Add horizontal padding for the text
  },
  label1: {
    fontSize: 24,
    fontFamily: 'sans-serif-medium',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  item: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 5,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 10,
  },
  price: {
    fontSize: 12,
    color: '#888',
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 10,
  },
  category: {
    fontSize: 10,
    color: '#555',
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 10,
  },
  loaderContainer: {
    paddingVertical: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  item1: {
    flexDirection: 'row',
    width: 120,
  },
  imageContainer1: {
    width: '80%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 5,
  },
  image1: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  arrivalsList: {
    flexWrap: 'wrap',
    paddingHorizontal: 10, // Add horizontal padding for the list items
  },
});

export default App;