import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from './src/screens/Login';
import ProductDetailScreen from './src/screens/ProductDetail';
import DrawerNavigator from './src/screens/DrawerNavigator'; // import the new drawer navigator

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        {/* Use DrawerNavigator instead of HomeScreen directly */}
        <Stack.Screen
          name="Home"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
 <Stack.Screen
  name="ProductDetailScreen"
  component={ProductDetailScreen}
  options={{
    title: 'Item Details',
    headerShown: true,
    headerTitleAlign: 'center', // 👈 This centers the title
  }}
/>


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
