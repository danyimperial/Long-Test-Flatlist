import React, { useEffect, useRef } from 'react';
import { View, TouchableWithoutFeedback, Dimensions, StyleSheet, Animated } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const FilterSlider = ({ visible, onClose, children }) => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current; // start off-screen right

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: screenWidth / 2, // slide in to half screen width from left
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenWidth, // slide out off-screen right
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  // Hide component if not visible and animation is finished
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Dimming background */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sliding panel */}
      <Animated.View style={[styles.slider, { left: slideAnim }]}>
        {children /* your filter UI */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // fill entire screen
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  slider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: screenWidth / 2,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    padding: 20,
  },
});

export default FilterSlider;
