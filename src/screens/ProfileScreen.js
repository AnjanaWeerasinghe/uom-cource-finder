import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => dispatch(logoutUser())
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Feather name="user" size={48} color="#000000" />
        </View>

        <Text style={styles.name}>{user?.name || user?.role === "teacher" ? "Teacher" : user?.role === "admin" ? "Admin" : "Student"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        {user?.role && (
          <View style={[styles.roleBadge, 
            user.role === "admin" && styles.adminBadge,
            user.role === "teacher" && styles.teacherBadge
          ]}>
            <Text style={styles.roleText}>
              {user.role === "admin" ? "ADMIN" : 
               user.role === "teacher" ? "TEACHER" : "STUDENT"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Feather name="mail" size={16} color="#000" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Feather name="user" size={16} color="#000" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{user?.name || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Feather name="shield" size={16} color="#000" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>
              {user?.role === "admin" ? "Administrator" : 
               user?.role === "teacher" ? "Teacher" : "Student"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={16} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  profileCard: {
    backgroundColor: "#000000",
    padding: 16,
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  email: {
    fontSize: 12,
    color: "#a3a3a3",
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 4,
  },
  adminBadge: {
    backgroundColor: "#ffffff",
  },
  teacherBadge: {
    backgroundColor: "#ffffff",
  },
  roleText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  infoSection: {
    backgroundColor: "#000000",
    marginTop: 8,
    marginHorizontal: 12,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  infoTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
    color: "#737373",
    marginBottom: 1,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#000000",
    marginHorizontal: 12,
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  logoutText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
