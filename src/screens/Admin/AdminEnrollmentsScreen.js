import React, { useEffect } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEnrollments } from "../../store/coursesSlice";
import { Feather } from "@expo/vector-icons";

export default function AdminEnrollmentsScreen() {
  const dispatch = useDispatch();
  const { allEnrollments, loading } = useSelector(s => s.courses);

  useEffect(() => {
    dispatch(fetchAllEnrollments());
  }, [dispatch]);

  if (!allEnrollments.length && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="inbox" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No Enrollments Yet</Text>
        <Text style={styles.emptySubtext}>
          User enrollments will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Enrollments</Text>
      <Text style={styles.subtitle}>
        Total: {allEnrollments.length} enrollment{allEnrollments.length !== 1 ? 's' : ''}
      </Text>

      <FlatList
        data={allEnrollments}
        keyExtractor={i => i.id}
        refreshing={loading}
        onRefresh={() => dispatch(fetchAllEnrollments())}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Feather name="user" size={20} color="#2563eb" />
              <Text style={styles.user}>{item.userName}</Text>
            </View>
            
            <Text style={styles.email}>{item.userEmail}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.courseInfo}>
              <Feather name="book" size={18} color="#10b981" />
              <Text style={styles.course}>{item.courseTitle}</Text>
            </View>
            
            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.courseCategory}</Text>
              </View>
              <Text style={styles.date}>
                {new Date(item.enrolledAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  user: {
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginLeft: 28,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  courseInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  course: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
