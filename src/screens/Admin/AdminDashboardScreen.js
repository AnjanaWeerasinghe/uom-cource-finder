import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../store/adminSlice";
import { fetchCourses } from "../../store/coursesSlice";
import { Feather } from "@expo/vector-icons";

export default function AdminDashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { users } = useSelector(s => s.admin);
  const { courses } = useSelector(s => s.courses);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchCourses());
  }, [dispatch]);

  const adminCount = users.filter(u => (u.role || "student") === "admin").length;
  const teacherCount = users.filter(u => (u.role || "student") === "teacher").length;
  const studentCount = users.filter(u => (u.role || "student") === "student").length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>System Overview</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#ef4444" + "20" }]}>
            <Feather name="shield" size={24} color="#ef4444" />
          </View>
          <Text style={styles.statNumber}>{adminCount}</Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#10b981" + "20" }]}>
            <Feather name="book-open" size={24} color="#10b981" />
          </View>
          <Text style={styles.statNumber}>{teacherCount}</Text>
          <Text style={styles.statLabel}>Teachers</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#2563eb" + "20" }]}>
            <Feather name="users" size={24} color="#2563eb" />
          </View>
          <Text style={styles.statNumber}>{studentCount}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#f59e0b" + "20" }]}>
            <Feather name="book" size={24} color="#f59e0b" />
          </View>
          <Text style={styles.statNumber}>{courses.length}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionCard}>
          <Feather name="users" size={20} color="#2563eb" />
          <Text style={styles.actionText}>
            Manage user roles and permissions through the Users tab
          </Text>
        </View>

        <View style={styles.actionCard}>
          <Feather name="book" size={20} color="#10b981" />
          <Text style={styles.actionText}>
            Teachers can create and manage courses through their dashboard
          </Text>
        </View>

        <View style={styles.actionCard}>
          <Feather name="settings" size={20} color="#f59e0b" />
          <Text style={styles.actionText}>
            System settings and configurations
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "#f1f5f9",
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickActions: {
    margin: 12,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    marginBottom: 8,
    gap: 10,
    borderWidth: 0.5,
    borderColor: "#f1f5f9",
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    fontWeight: "500",
  },
});