import { StyleSheet } from 'react-native';

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 30,
    left: 25,
    right: 30,
    // REMOVED: zIndex: 10, // As requested
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: 50,
    fontWeight: '800',
  },

  bellIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bellIcon: {
    color: 'gray', // Assuming you want it white as per your JSX usage
  },

  header: {
    width: '100%',
    height: 100, // Header occupies this space
    marginBottom: 20,
    overflow: 'hidden',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    position: 'relative', // Keep if headerTextContainer is absolute to it
  },
  headerImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerTextContainer: {
    position: 'absolute',
    // top: 115, // Commented out in your code, keeping it that way
    left: 25,
    padding: 10,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerText1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  searchBar: {
    // REMOVED: position: 'absolute',
    // REMOVED: top: 80,
    // REMOVED: left: 25,
    // REMOVED: right: 10,
    height: 48, // Keep the fixed height
    // REMOVED: width: 350, // Will now expand with marginHorizontal

    // NEW: Margins for normal flow
    marginTop: -40, // Pulls the search bar up to overlap the header visually
                     // (250 - 48 - 120 approx, adjust as needed)
                     // Let's aim for the search bar to start around Y=210 (250 - 40)
    marginHorizontal: 25, // Side spacing

    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    // REMOVED: zIndex: 1, // As requested
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  icon: {
    color: '#888',
    fontSize: 20,
    marginRight: 10,
  },

  seriesContainer: {
    marginBottom: 20,
  },
  
  labelRow: {
    // Ensure labelRow has position: 'relative' for absolute children to work
    position: 'relative', // ADD THIS!
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Keep this as you requested
    paddingHorizontal: 14, // Keep your current padding

    marginTop: 20,
    marginBottom: 15,
  },


  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // --- FLATLIST STYLES ---
  arrivalsList: {
    flex: 1, // Crucial: Makes the FlatList take up remaining vertical space
    // REMOVED: paddingHorizontal: 10, // Move to contentContainerStyle
  },
  flatListContentContainer: {
    // REMOVED: paddingTop: 183 + 15, // No longer needed for normal flow
    paddingHorizontal: 10, // Apply horizontal padding to the content
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

  price: {
    fontSize: 16,
    color: 'red',
    fontWeight: '700',
    textAlign: 'left',
    width: '100%',
  },

  titleCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },

  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1,
    flexGrow: 1,
    marginRight: 8,
    overflow: 'hidden',
  },

  category: {
    fontSize: 12,
    color: '#555',
    flexShrink: 0,
  },

  listerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
  },

  listerImage: {
    width: 16,
    height: 16,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: '#eee',
  },

  listerName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'left',
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
      flex: 1, // Crucial: Makes the FlatList take up remaining vertical space

    // flexWrap: 'wrap',
    paddingHorizontal: 10,
  },

  loadMoreButtonContainer: {
    paddingVertical: 5,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  loadMoreButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    color: 'white',
    fontSize: 16,
  },

  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  filteredImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 5,
  },

  filteredImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default mainStyles;