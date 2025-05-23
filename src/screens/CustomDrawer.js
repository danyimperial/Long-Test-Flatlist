import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

const CustomDrawer = () => {
  const navigation = useNavigation();

  // State for the category Picker (currently not used in filter logic, see notes below)
  const [selectedCategory, setSelectedCategory] = useState("default");

  // State for the category filter buttons
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);

  // State for price range buttons (e.g., '1-5K')
  const [selectedPriceRangeButton, setSelectedPriceRangeButton] = useState(null);

  // State for min/max value inputs
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  // State for sorting order (ASC/DESC)
  const [selectedSortOrder, setSelectedSortOrder] = useState(null); // 'price_asc', 'price_desc', or null

  const [applyLoading, setApplyLoading] = useState(false);

  const buttons = [
    'Bags', 'Shoes', 'Jewelry', 'Toys',
    'Watches', 'Automotive and Parts', 'Electronics and Gadgets', 'Clothing',
    'Eyewear', 'Musical Instrument', 'Trading Cards', 'Artworks',
    'Rare Coins', 'Books and Comic Books', 'Stamps', 'Antiques',
    'Music', 'Movie', 'Sports', 'Others',
  ];

  // Group buttons into pairs for layout
  const groupedButtons = buttons.reduce((acc, curr, index) => {
    if (index % 2 === 0) acc.push([curr]);
    else acc[acc.length - 1].push(curr);
    return acc;
  }, []);

  const priceRanges = ['1-5K', '5k-10k', '10k-50k', '50k-100k'];

  // --- Validation for min/max inputs ---
  const isValidRange = () => {
    // Only validate if both are numbers and min is not greater than max
    if (minValue === '' || maxValue === '') {
      return true; // Empty fields are valid (means no range filter)
    }
    const minNum = Number(minValue);
    const maxNum = Number(maxValue);
    return !isNaN(minNum) && !isNaN(maxNum) && minNum <= maxNum;
  };

  // --- Apply Filters Logic ---
  const onApplyPress = () => {
    if (applyLoading) return;

    if (!isValidRange()) {
      Alert.alert('Invalid Range', 'Min value cannot be greater than Max value or contains non-numeric input.');
      return;
    }

    setApplyLoading(true);

    let finalMin = minValue;
    let finalMax = maxValue;

    // If a price range button is selected, it populates min/max
    // This logic assumes button takes precedence over manual input if both are selected.
    if (selectedPriceRangeButton) {
      switch (selectedPriceRangeButton) {
        case '1-5K':
          finalMin = '1';
          finalMax = '5000';
          break;
        case '5k-10k':
          finalMin = '5000';
          finalMax = '10000';
          break;
        case '10k-50k':
          finalMin = '10000';
          finalMax = '50000';
          break;
        case '50k-100k':
          finalMin = '50000';
          finalMax = '100000';
          break;
        default:
          break;
      }
    }

    console.log('Apply clicked with filters for navigation:');
    console.log('Category:', selectedCategoryFilter);
    console.log('Min Value:', finalMin);
    console.log('Max Value:', finalMax);
    console.log('Sort Order:', selectedSortOrder);

    // Navigate back to Home screen with the collected filter parameters
    navigation.navigate('Home', {
      category: selectedCategoryFilter,
      min: finalMin, // Pass the parsed min
      max: finalMax, // Pass the parsed max
      sort: selectedSortOrder, // Pass the selected sort order (e.g., 'price_asc', 'price_desc')
    });

    // Reset loading state after navigation
    setTimeout(() => setApplyLoading(false), 1000);
  };

  // --- Render Method ---
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.title}>Sort</Text>
        {/*
          NOTE: The Picker for "Category" here (selectedCategory state) is not
          currently integrated into the `onApplyPress` filter logic.
          It might be redundant if "Filter by Category" buttons are the primary method.
          Consider removing it or integrating its value into `selectedCategoryFilter`
          if you want both to be active.
        */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCategory}
            style={styles.picker}
            onValueChange={setSelectedCategory}
          >
            <Picker.Item label="Category" value="default" />
            <Picker.Item label="Category 1" value="cat1" />
            <Picker.Item label="Category 2" value="cat2" />
          </Picker>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[styles.button, selectedSortOrder === 'price_asc' && styles.selectedButton]}
            onPress={() => setSelectedSortOrder('price_asc')}
            disabled={applyLoading}>
            <Text style={[styles.buttonText, selectedSortOrder === 'price_asc' && styles.selectedButtonText]}>ASC</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedSortOrder === 'price_desc' && styles.selectedButton]}
            onPress={() => setSelectedSortOrder('price_desc')}
            disabled={applyLoading}>
            <Text style={[styles.buttonText, selectedSortOrder === 'price_desc' && styles.selectedButtonText]}>DESC</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
        <Text style={styles.title}>Filter by Category</Text>

        <View style={styles.categoryButtonsContainer}>
          {groupedButtons.map((pair, rowIndex) => (
            <View key={rowIndex} style={styles.categoryRow}>
              {pair.map((label, index) => {
                const isSelected = selectedCategoryFilter === label;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterbutton,
                      isSelected && styles.selectedFilterButton,
                      applyLoading && { opacity: 0.6 }
                    ]}
                    onPress={() =>
                      !applyLoading &&
                      setSelectedCategoryFilter(label === selectedCategoryFilter ? null : label)
                    }
                    disabled={applyLoading}
                  >
                    <Text
                      style={[
                        styles.filterbuttonText,
                        isSelected && styles.selectedFilterText,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.title}>Value Range</Text>
        <View style={styles.rangeContainer}>
          <TextInput
            style={styles.rangeInput}
            placeholder="Min"
            keyboardType="numeric"
            value={minValue}
            onChangeText={setMinValue}
            editable={!applyLoading}
          />
          <Text style={styles.dash}>—</Text>
          <TextInput
            style={styles.rangeInput}
            placeholder="Max"
            keyboardType="numeric"
            value={maxValue}
            onChangeText={setMaxValue}
            editable={!applyLoading}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {priceRanges.map((label, index) => {
            const isSelected = selectedPriceRangeButton === label;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.priceButton,
                  isSelected && styles.selectedPriceButton,
                  applyLoading && { opacity: 0.6 }
                ]}
                onPress={() =>
                  !applyLoading &&
                  setSelectedPriceRangeButton(label === selectedPriceRangeButton ? null : label)
                }
                disabled={applyLoading}
              >
                <Text style={[styles.priceButtonText, isSelected && styles.selectedPriceText]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>

      <View style={styles.fixedFooter}>
        <TouchableOpacity
          style={[styles.clearButton, applyLoading && { opacity: 0.6 }]}
          onPress={() => {
            if (applyLoading) return;
            setSelectedCategory("default"); // Clear picker
            setSelectedCategoryFilter(null); // Clear category buttons
            setSelectedPriceRangeButton(null); // Clear price range buttons
            setMinValue(''); // Clear min input
            setMaxValue(''); // Clear max input
            setSelectedSortOrder(null); // Clear sort order
          }}
          disabled={applyLoading}
        >
          <Text style={styles.footerButtonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.applyButton, (applyLoading || !isValidRange()) && { opacity: 0.6 }]}
          onPress={onApplyPress}
          disabled={applyLoading || !isValidRange()}
        >
          <Text style={styles.footerButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontWeight: 'bold', fontSize: 16, marginVertical: 4 },
  pickerWrapper: { backgroundColor: '#e9e9e9', borderRadius: 5, marginBottom: 15 },
  picker: { height: 50, width: '100%' },
  divider: { borderBottomColor: '#ccc', borderBottomWidth: 1, marginTop: 15 },

  button: {
    backgroundColor: '#e9e9e9',
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1, // Add border to show selection
    borderColor: 'transparent',
  },
  selectedButton: { // Style for selected ASC/DESC buttons
    borderColor: '#ac895c',
    backgroundColor: '#fff3e0',
  },
  buttonText: { fontWeight: '400' },
  selectedButtonText: {
    color: '#ac895c',
    fontWeight: 'bold',
  },

  categoryButtonsContainer: {
    // Add styling for the container of category buttons if needed
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterbutton: {
    backgroundColor: '#e9e9e9',
    paddingVertical: 5,
    paddingHorizontal: 12,
    margin: 4,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedFilterButton: {
    borderColor: '#ac895c',
    backgroundColor: '#fff3e0',
  },
  filterbuttonText: {
    fontWeight: '400',
    margin: 6,
  },
  selectedFilterText: {
    color: '#ac895c',
    fontWeight: 'bold',
  },

  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rangeInput: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 145, // Adjusted width for better fit
    height: 50,
    textAlign: 'left',
  },
  dash: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#555',
  },

  priceButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#e9e9e9',
    borderRadius: 20,
    marginRight: 5,
    borderWidth: 1, // Add border to show selection
    borderColor: 'transparent',
  },
  selectedPriceButton: {
    backgroundColor: '#ac895c',
    borderColor: '#ac895c',
  },
  priceButtonText: {
    fontSize: 14,
  },
  selectedPriceText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    zIndex: 10,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#e9e9e9',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#ac895c',
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  footerButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000', // Keep text black for better contrast on non-selected
  },
});

export default CustomDrawer;