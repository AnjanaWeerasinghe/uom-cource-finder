import React, { useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, updateUserRole } from "../../store/adminSlice";
import { Feather } from "@expo/vector-icons";

export default function UserManagementScreen() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(s => s.admin);
  const currentUser = useSelector(s => s.auth.user);

  useEffect(() => {
    console.log("UserManagementScreen: fetching users...");
    console.log("Current user role:", currentUser?.role);
    console.log("Current user UID:", currentUser?.uid);
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    console.log("UserManagementScreen: users updated:", users.length);
    console.log("UserManagementScreen: current user:", currentUser);
    console.log("UserManagementScreen: error:", error);
  }, [users, currentUser, error]);

  const setRole = (uid, role, userName) => {
    Alert.alert(
      "Change User Role",
      `Set ${userName} as ${role.toUpperCase()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await dispatch(updateUserRole({ uid, role })).unwrap();
              Alert.alert("Success", `User role updated to ${role}`);
            } catch (error) {
              Alert.alert("Error", "Failed to update user role");
            }
          }
        }
      ]
    );
  };

  const getRoleColor = (role) => {
    switch(role) {
      case "admin": return "#ef4444";
      case "teacher": return "#10b981";
      case "student": return "#2563eb";
      default: return "#64748b";
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case "admin": return "shield";
      case "teacher": return "book-open";
      case "student": return "user";
      default: return "user";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="users" size={28} color="#2563eb" />
        <Text style={styles.title}>Manage Users</Text>
        <TouchableOpacity 
          style={styles.refreshBtn}
          onPress={() => dispatch(fetchAllUsers())}
        >
          <Feather name="refresh-cw" size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity onPress={() => dispatch(fetchAllUsers())}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.filter(u => (u.role || "student") === "admin").length}</Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.filter(u => (u.role || "student") === "teacher").length}</Text>
          <Text style={styles.statLabel}>Teachers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.filter(u => (u.role || "student") === "student").length}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={u => u.uid}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchAllUsers())}
            colors={["#2563eb"]}
            tintColor="#2563eb"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const userRole = item.role || "student"; // Default to student if no role
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <View style={[styles.avatar, { backgroundColor: getRoleColor(userRole) + "20" }]}>
                    <Feather name={getRoleIcon(userRole)} size={24} color={getRoleColor(userRole)} />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(userRole) }]}>
                      <Text style={styles.roleText}>{userRole.toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
              </View>

            {item.uid !== currentUser?.uid && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.roleBtn, { backgroundColor: "#2563eb" }]}
                  onPress={() => setRole(item.uid, "student", item.name)}
                >
                  <Feather name="user" size={16} color="#fff" />
                  <Text style={styles.btnText}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleBtn, { backgroundColor: "#10b981" }]}
                  onPress={() => setRole(item.uid, "teacher", item.name)}
                >
                  <Feather name="book-open" size={16} color="#fff" />
                  <Text style={styles.btnText}>Teacher</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleBtn, { backgroundColor: "#ef4444" }]}
                  onPress={() => setRole(item.uid, "admin", item.name)}
                >
                  <Feather name="shield" size={16} color="#fff" />
                  <Text style={styles.btnText}>Admin</Text>
                </TouchableOpacity>
              </View>
            )}
            {item.uid === currentUser?.uid && (
              <Text style={styles.currentUserLabel}>Current User (You)</Text>
            )}
          </View>
        );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="users" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  refreshBtn: {
    padding: 8,
  },
  statsRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  email: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  roleText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  currentUserLabel: {
    color: "#64748b",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: "#fecaca",
    borderWidth: 1,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
  retryText: {
    color: "#2563eb",
    fontSize: 14,
    marginTop: 4,
    textDecorationLine: "underline",
  },
});
