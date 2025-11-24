import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { listenToAuthChanges } from '../store/authSlice';
import { loadFavourites } from '../store/coursesSlice';
import { Feather } from '@expo/vector-icons';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const user = useSelector(state => state.auth.user);

  return (
    <Tab.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#fff' },
      tabBarStyle: { backgroundColor: '#fff' },
    }}>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{
          headerTitle: `Welcome, ${user?.name || 'User'}`,
          tabBarIcon: () => <Feather name="home" size={22} />,
        }}
      />
      <Tab.Screen name="Favourites" component={FavouritesScreen}
        options={{
          tabBarIcon: () => <Feather name="star" size={22} />,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
          tabBarIcon: () => <Feather name="user" size={22} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(listenToAuthChanges());
    dispatch(loadFavourites());
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen name="Details" component={DetailsScreen} />
          </>
        ) : (
          <RootStack.Screen name="AuthStack" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
