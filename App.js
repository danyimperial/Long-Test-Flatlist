import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TextInput, RefreshControl, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import mainStyles from './MainStyle';  
import BottomNav from './BottomNav'; 

const endpoint = 'https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/Xchange';
const initialParams = {
  "categories": [],
  "last_listing_id": "",
  "last_row_value": "",
  "max": "",
  "min": "",
  "search": "",
  "sort": "",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJuYmYiOjE3NDYxOTI1MTQsImV4cCI6MTc0ODc4NDUxNCwiaXNzIjoiWHVyMzRQMSIsImF1ZCI6Ilh1cjQ0UFAifQ.QD-fcLXtznCfkTIYkbOQfc5fXfxYgw_mOziKWpUHddk",
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
  const [searchText, setSearchText] = useState('');
  const isFiltered = searchText.trim().length > 0;



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


  const handleSearch = useCallback((text) => {
    setSearchText(text);
  }, []);
  
  const submitSearch = useCallback(() => {
    setData([]);
    setParams({
      ...initialParams,
      search: searchText
    });
  }, [searchText]);

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

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={mainStyles.item}>
        <View style={isFiltered ? mainStyles.filteredImageContainer : mainStyles.imageContainer}>
          {item.item_image && (
            <Image
              source={{ uri: item.item_image }}
              style={isFiltered ? mainStyles.filteredImage : mainStyles.image}
              resizeMode="cover"
            />
          )}
        </View>
  
        <View style={mainStyles.titleCategoryRow}>
          <Text style={mainStyles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.model}
          </Text>
          <Text style={mainStyles.category}>{item.category}</Text>
        </View>
  
        <Text style={mainStyles.price}>PHP {item.selling_price}</Text>
  
        <View style={mainStyles.listerInfo}>
          {item.lister_image && (
            <Image
              source={{ uri: item.lister_image }}
              style={mainStyles.listerImage}
              resizeMode="cover"
            />
          )}
          <Text style={mainStyles.listerName}>{item.lister_name}</Text>
        </View>
      </View>
    );
  }, [isFiltered]);
  

  // const renderFooter = useCallback(() => {
  //   if (loading) {
  //     return (
  //       <View style={mainStyles.loaderContainer}>
  //         <ActivityIndicator size="large" color="blue" />
  //       </View>
  //     );
  //   } else if (data.length > 0) {
  //     return (
  //       <View style={mainStyles.loadMoreButtonContainer}>
  //         <Text
  //           style={mainStyles.loadMoreButton}
  //           onPress={handleLoadMore}
  //         >
  //           Load More
  //         </Text>
  //       </View>
  //     );
  //   }
  //   return null;
  // }, [loading, data]);
  
  
  
  const keyExtractor = useCallback((item) => item.listing_id ? item.listing_id.toString() : Math.random().toString(), []);

  return (
    <View style={mainStyles.container}>
      {error && <Text style={mainStyles.errorText}>Error: {error}</Text>}

      <View style={mainStyles.header}>
        <Image source={require('./src/assets/cute.png')} style={mainStyles.headerImage} />

        <View style={mainStyles.overlay}>
          <Image source={require('./src/assets/popmartlogo.png')} style={mainStyles.logo} />
          <View style={mainStyles.bellIconContainer}>
            <Ionicons name="notifications" size={24} color="white" style={mainStyles.bellIcon} />
          </View>
        </View>

        <View style={mainStyles.headerTextContainer}>
          <Text style={mainStyles.headerText}>New Release</Text>
          <Text style={mainStyles.headerText1}>DIMOO</Text>

        </View>
      </View>

      <View style={mainStyles.searchBar}>
  <Ionicons name="search" size={20} color="#000" />
  <TextInput
    style={mainStyles.searchInput}
    placeholder="Search"
    value={searchText}
    onChangeText={handleSearch}
    onSubmitEditing={submitSearch}
    returnKeyType="search"
  />
</View>


      <View style={mainStyles.labelRow}>
        <Text style={mainStyles.label}>Daily Discovery</Text>
        <Ionicons name="filter" size={20} color="#000" />
      </View>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        
        renderItem={(props) => renderItem(props)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        // ListFooterComponent={renderFooter}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={mainStyles.arrivalsList}
      />

      {/* {!loading && data.length > 0 && (
        <TouchableOpacity
          style={mainStyles.loadMoreButton}
          onPress={handleLoadMore}
        >
          <Text style={mainStyles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      )} */}

      <BottomNav />
    </View>
  );
};

export default App;
