import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import AuthNavigator from "./AuthNavigator";
import { listenToAuthChanges } from "../store/authSlice";
import { loadFavourites } from "../store/coursesSlice";

// Admin
import AdminHomeScreen from "../screens/Admin/AdminHomeScreen";
import AddCourseScreen from "../screens/Admin/AddCourseScreen";
import EditCourseScreen from "../screens/Admin/EditCourseScreen";
import UserManagementScreen from "../screens/Admin/UserManagementScreen";
import CourseEnrollmentsScreen from "../screens/Admin/CourseEnrollmentsScreen";
// import AdminEnrollmentsScreen from "../screens/Admin/AdminEnrollmentsScreen";

// Teacher
import TeacherHomeScreen from "../screens/Teacher/TeacherHomeScreen";
import TeacherCourseWorksScreen from "../screens/Teacher/TeacherCourseWorksScreen";
import AddWorkScreen from "../screens/Teacher/AddWorkScreen";
import WorkSubmissionsScreen from "../screens/Teacher/WorkSubmissionsScreen";
import TeacherNotificationsScreen from "../screens/Teacher/TeacherNotificationsScreen";

// Student
import HomeScreen from "../screens/Student/HomeScreen";
import DetailsScreen from "../screens/Student/DetailsScreen";
import FavouritesScreen from "../screens/Student/FavouritesScreen";
import EnrolledScreen from "../screens/Student/EnrolledScreen";
import StudentCourseWorksScreen from "../screens/Student/StudentCourseWorksScreen";
import SubmitWorkScreen from "../screens/Student/SubmitWorkScreen";
import MySubmissionsScreen from "../screens/Student/MySubmissionsScreen";
import NotificationsScreen from "../screens/Student/NotificationsScreen";
import ProfileScreen from "../screens/Student/ProfileScreen";

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
          title: "Courses",
          tabBarIcon: ({ color }) => <Feather name="book" size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={UserManagementScreen}
        options={{
          title: "Users",
          tabBarIcon: ({ color }) => <Feather name="users" size={22} color={color} />,
          tabBarLabel: "Users",
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

function TeacherTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#fff' },
      tabBarStyle: { backgroundColor: '#fff' },
    }}>
      <Tab.Screen 
        name="TeacherHome" 
        component={TeacherHomeScreen}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen 
        name="Courses" 
        component={HomeScreen}
        options={{
          title: "Browse Courses",
          tabBarIcon: ({ color }) => <Feather name="book" size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={TeacherNotificationsScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="bell" size={22} color={color} />,
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

function StudentTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#fff' },
      tabBarStyle: { backgroundColor: '#fff' },
    }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="book" size={22} color={color} />,
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
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="bell" size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="MySubmissions" 
        component={MySubmissionsScreen}
        options={{
          title: "Submissions",
          tabBarIcon: ({ color }) => <Feather name="send" size={22} color={color} />,
          tabBarLabel: "Submissions",
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
            ) : user.role === "teacher" ? (
              <RootStack.Screen name="TeacherTabs" component={TeacherTabs} />
            ) : (
              <RootStack.Screen name="StudentTabs" component={StudentTabs} />
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
            <RootStack.Screen 
              name="AddWork" 
              component={AddWorkScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="WorkSubmissions" 
              component={WorkSubmissionsScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="StudentCourseWorks" 
              component={StudentCourseWorksScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="TeacherCourseWorks" 
              component={TeacherCourseWorksScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="SubmitWork" 
              component={SubmitWorkScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
