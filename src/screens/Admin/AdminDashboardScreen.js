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
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 4,
  },
  quickActions: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
});