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
import EnrolledScreen from '../screens/EnrolledScreen';
import AdminHomeScreen from '../screens/Admin/AdminHomeScreen';
import AdminEnrollmentsScreen from '../screens/Admin/AdminEnrollmentsScreen';
import CourseEnrollmentsScreen from '../screens/Admin/CourseEnrollmentsScreen';
import AddCourseScreen from '../screens/Admin/AddCourseScreen';
import EditCourseScreen from '../screens/Admin/EditCourseScreen';

import { listenToAuthChanges } from '../store/authSlice';
import { loadFavourites } from '../store/coursesSlice';
import { Feather } from '@expo/vector-icons';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#fff' },
      tabBarStyle: { backgroundColor: '#fff' },
    }}>
      <Tab.Screen 
        name="AdminHome" 
        component={AdminHomeScreen}
        options={{
          title: "Manage Courses",
          tabBarIcon: ({ color }) => <Feather name="settings" size={22} color={color} />,
          tabBarLabel: "Manage",
        }}
      />
      <Tab.Screen 
        name="Enrollments" 
        component={AdminEnrollmentsScreen}
        options={{
          title: "Enrollments",
          tabBarIcon: ({ color }) => <Feather name="list" size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function UserTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#fff' },
      tabBarStyle: { backgroundColor: '#fff' },
    }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Favourites" 
        component={FavouritesScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="star" size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Enrolled" 
        component={EnrolledScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="check-circle" size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
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
  }, [dispatch]);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            {user.role === "admin" ? (
              <RootStack.Screen name="AdminTabs" component={AdminTabs} />
            ) : (
              <RootStack.Screen name="UserTabs" component={UserTabs} />
            )}
            <RootStack.Screen 
              name="Details" 
              component={DetailsScreen}
              options={{ headerShown: true, title: "Course Details" }}
            />
            <RootStack.Screen 
              name="AddCourse" 
              component={AddCourseScreen}
              options={{ headerShown: true, title: "Add Course" }}
            />
            <RootStack.Screen 
              name="EditCourse" 
              component={EditCourseScreen}
              options={{ headerShown: true, title: "Edit Course" }}
            />
            <RootStack.Screen 
              name="CourseEnrollments" 
              component={CourseEnrollmentsScreen}
              options={{ headerShown: true, title: "Course Enrollments" }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
