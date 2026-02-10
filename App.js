import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import des reducers
import user from './reducers/user';
import photos from './reducers/photos';


// Import des screens
import HomeScreen from './screens/HomeScreen.js';
import GalleryScreen from './screens/GalleryScreen.js';
import SnapScreen from './screens/SnapScreen.js';

// Configuration du store Redux
const store = configureStore({
  reducer: { user, photos },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configuration du TabNavigator (menu du bas)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Snap') {
            iconName = 'camera';
          } else if (route.name === 'Gallery') {
            iconName = 'image';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e8be4b',
        tabBarInactiveTintColor: '#b2b2b2',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Snap" component={SnapScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
    </Tab.Navigator>
  );
}

// Configuration de la navigation principale
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}