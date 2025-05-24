import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
  Animated, 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { width, height } = Dimensions.get('window');

const MessageModal = ({ visible, message, onClose }) => {
  return (
    <Modal
      animationType="fade" 
      transparent={true}   
      visible={visible}    
      onRequestClose={onClose} 
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>{message}</Text>
          <TouchableOpacity
            style={modalStyles.buttonClose}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={modalStyles.textStyle}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.8, 
    maxWidth: 400,      
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonClose: {
    backgroundColor: '#59238c', 
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSplash, setShowSplash] = useState(true); 
  const [isLoading, setIsLoading] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [modalMessage, setModalMessage] = useState('');   
  const [showPassword, setShowPassword] = useState(false);
  

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  const showMessage = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideMessage = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const handleLogin = async () => {
    setIsLoading(true); 
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300, 
      useNativeDriver: true,
    }).start();

    try {
      const response = await fetch('https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/LoginXpert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          version_number: '2.2.6',
          Username: email,
          Password: password,
          app_name: 'xtore'
        })
      });

      const text = await response.text();
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('JSON parse error:', e.message);
        showMessage('Invalid server response'); 
        return;
      }

      const token = data?.XpertData?.[0]?.token;

      if (token) {
        setTimeout(() => {
          navigation.navigate('Home', { token }); 
          fadeAnim.setValue(0); 
        }, 500); 
      } else {
        showMessage('Login failed: Token not found.'); 
      }

    } catch (error) {
      console.error('Login error:', error);
      showMessage('Login Error: An error occurred during login.'); 
    } finally {

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300, 
        useNativeDriver: true,
      }).start(() => setIsLoading(false)); 
    }
  };


  if (showSplash) {
    return (
      <View style={splashStyles.container}>
        <Text style={splashStyles.logo}>XURE</Text>
        <ActivityIndicator size="large" color="#C89B5D" style={splashStyles.spinner} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>XURE</Text>
      <Text style={styles.title}>Sign In</Text>

   <View style={styles.inputWrapper}>
  <TextInput
    style={styles.input}
    placeholder="Email address or username"
    value={email}
    onChangeText={setEmail}
    autoCapitalize="none"
    keyboardType="email-address"
  />

  <View style={styles.passwordWrapper}>
    <TextInput
      style={styles.passwordInput}
      placeholder="Password"
      secureTextEntry={!showPassword}
      value={password}
      onChangeText={setPassword}
    />
    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
      style={styles.eyeIcon}
    >
      <Ionicons
        name={showPassword ? 'eye' : 'eye-off'}
        size={22}
        color="#666"
      />
    </TouchableOpacity>
  </View>

  <TouchableOpacity
    style={styles.button}
    onPress={handleLogin}
    activeOpacity={0.7}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.buttonText}>Login</Text>
    )}
  </TouchableOpacity>

  <TouchableOpacity>
    <Text style={styles.forgotPassword}>Forgot Password?</Text>
  </TouchableOpacity>
</View>

      <View style={styles.accountWrapper}>
        <Text style={styles.accountText}>Don't have an account?</Text>
      <TouchableOpacity style={styles.createAccountButton} onPress={() => console.log('Navigate to Sign Up')}>
  <Text style={styles.createAccountText}>Create an Account</Text>
</TouchableOpacity>

      </View>

      {/* --- Post-Login Loading Overlay --- */}
      {isLoading && (
        <Animated.View style={[styles.loadingOverlay, { opacity: fadeAnim }]}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingLogo}>XURE</Text>
            <ActivityIndicator size="large" color="#C89B5D" />
          </View>
        </Animated.View>
      )}

      {/* Custom Message Modal */}
      <MessageModal
        visible={modalVisible}
        message={modalMessage}
        onClose={hideMessage}
      />
    </View>
  );
};

// Styles for the initial splash screen
const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', 
  },
  logo: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#C89B5D', 
    marginBottom: 20,
  },
  spinner: {
    marginTop: 20,
  },
});

// Styles for the SignInScreen and its loading overlay
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f2f5', 
  },
  logo: {
    margin: 50,
    fontSize: 100 ,
    fontWeight: 'bold',
    color: '#C89B5D',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    fontWeight: '600',
    color: '#333',
  },
  inputWrapper: {
    width: '90%', 
    maxWidth: 400, 
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#59238c',
    padding: 15,
    borderRadius: 30,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#C89B5D',
    marginTop: 15,
    alignSelf: 'flex-end',
    fontSize: 14,
    fontWeight: '500',
  },
accountWrapper: {
  marginTop: 200,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 20,
  borderTopWidth: 1,
  borderTopColor: '#eee',
  width: '90%',
  maxWidth: 400,
  alignSelf: 'center', 
},

createAccountButton: {
  width: '100%',
  borderWidth: 1,
  borderColor: '#800080',
  borderRadius: 10,
  paddingVertical: 12,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 8,
},

createAccountText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#800080',
},


  // Styles for the post-login loading overlay
  loadingOverlay: {
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, 
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  loadingLogo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#C89B5D', 
    marginBottom: 20,
  },
 passwordWrapper: { 
  position: 'relative',
  width: '100%',
  marginBottom: 15,
},
passwordInput: {
  width: '100%',
  padding: 15,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  backgroundColor: '#fff',
  fontSize: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  paddingRight: 50, 
},
eyeIcon: {
  position: 'absolute',
  left: '90%',
  top: '50%',
  transform: [{ translateY: -11 }],
  zIndex: 1,
},

});

export default SignInScreen; 
