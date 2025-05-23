import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const DropdownSection = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.section}>
     <TouchableOpacity
  onPress={() => setExpanded(!expanded)}
  style={styles.sectionHeader}
  activeOpacity={0.8}
>
     <Text style={styles.sectionTitle}>{title}</Text>
  <Ionicons
    name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
    size={20}
    color="#333"
    style={styles.chevronIcon}
  />
 
</TouchableOpacity>

      {expanded && <View style={styles.dropdownBox}>{children}</View>}
    </View>
  );
};

const ProductDetailScreen = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView>
      {/* Static height Top Image */}
      {item.item_image && (
        <Image
          source={{ uri: item.item_image }}
          style={styles.topImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.container}>
        <Text style={styles.title}>{item.model}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>HKD {item.selling_price}.00</Text>

        <View style={styles.divider} />

        <View style={styles.listerRow}>
          {item.lister_image && (
            <Image
              source={{ uri: item.lister_image }}
              style={styles.listerImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.listerInfo}>
            <Text style={styles.listerText}>Name: {item.lister_name}</Text>
            <Text style={styles.listerText}>Lister ID: {item.lister_id}</Text>
            <Text style={styles.listerText}>Listing ID: {item.item_no}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <DropdownSection title="Specification">
          <InfoRow label="Category" value={item.category} />
          
        <View style={styles.divider} />
          <InfoRow label="Brand" value={item.brand} />
          
        <View style={styles.divider} />
          <InfoRow label="Model" value={item.model} />
          
        <View style={styles.divider} />
          <InfoRow label="Appraised Value" value={`HKD ${item.selling_price}.00`} />
        </DropdownSection>

        <View style={styles.divider} />

        <DropdownSection title="Description">
          <InfoRow label="Date" value={new Date(item.listing_date).toLocaleDateString()} />
                  <View style={styles.divider} />

          <InfoRow label="Registered by" value={item.lister_name} />
        </DropdownSection>

        <View style={styles.divider} />

        {item.role && (
          <DropdownSection title="Provenance">
            <InfoRow label="Date" value={new Date(item.listing_date).toLocaleDateString()} />
                    <View style={styles.divider} />

            <InfoRow label="Type" value={item.lister_type} />
                    <View style={styles.divider} />

            <InfoRow label="Certified by" value={item.lister_name} />
                    <View style={styles.divider} />

            <InfoRow label="Control No" value={item.item_no} />
          </DropdownSection>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  topImage: {
    width: '100%',
    height: 300, // Fixed static height
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  category: { fontSize: 16, color: '#555', marginBottom: 4 },
  price: { fontSize: 18, color: 'green', fontWeight: 'bold', marginBottom: 12 },

  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },

  listerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  listerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  listerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  listerText: {
    fontSize: 14,
    marginBottom: 2,
  },

  section: { marginBottom: 12 },
sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 12, // Add this line to give left/right spacing
  paddingVertical: 8,
},


chevronIcon: {
  marginRight: 4,
},

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    fontWeight: '400',
    color: '#333',
    maxWidth: '60%',
    textAlign: 'right',
  },
});

export default ProductDetailScreen;
