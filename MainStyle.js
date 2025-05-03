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
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  logo: {
    width: 100,
    height: 25,
    resizeMode: 'contain',
  },

  
  bellIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    borderRadius: 50,  
    padding: 8,  
    justifyContent: 'center',
    alignItems: 'center', 
  },

  bellIcon: {
    color: 'white',  
  },
  
  header: {
    width: '100%',
    height: 250, 
    overflow: 'hidden',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
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
    top: 115, 
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
    position: 'absolute',
    top: 220, 
    left: 34,
    right: 10,
    height: 48,
    width: '84%',
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 5, 
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 50,
    marginBottom: 20,
  },
  
  label: {
    fontSize: 20,
    fontFamily: 'sans-serif-medium',
    fontWeight: 'bold',
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
    flexWrap: 'wrap',
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
