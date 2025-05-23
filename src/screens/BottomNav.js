import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BottomNav = () => {
  return (
    <View style={styles.bottomNav}>
      <View style={styles.navItem}>
        <Ionicons name="home" size={24} color="#555" />
        <Text style={styles.navText}>Home</Text>
      </View>
      <View style={styles.navItem}>
        <Ionicons name="search" size={24} color="#555" />
        <Text style={styles.navText}>Search</Text>
      </View>
      <View style={styles.navItem}>
        <Ionicons name="cart" size={24} color="#555" />
        <Text style={styles.navText}>Cart</Text>
      </View>
      <View style={styles.navItem}>
        <Ionicons name="person" size={24} color="#555" />
        <Text style={styles.navText}>Profile</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#555',
  },
});

export default BottomNav;
