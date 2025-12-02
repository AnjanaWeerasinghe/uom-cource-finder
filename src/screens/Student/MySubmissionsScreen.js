import React, { useEffect } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySubmissions } from "../../store/worksSlice";
import SubmissionCard from "../../components/SubmissionCard";
import { Feather } from "@expo/vector-icons";

export default function MySubmissionsScreen() {
  const dispatch = useDispatch();
  const student = useSelector(s => s.auth.user);
  const { mySubmissions, loading } = useSelector(s => s.works);

  useEffect(() => {
    if (student?.uid) {
      dispatch(fetchMySubmissions(student.uid));
    }
  }, [student?.uid, dispatch]);

  const gradedCount = mySubmissions.filter(s => s.status === "graded").length;
  const pendingCount = mySubmissions.filter(s => s.status === "submitted").length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Submissions</Text>
        <Text style={styles.headerSubtitle}>Track your coursework submissions</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{mySubmissions.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#10b981" }]}>{gradedCount}</Text>
          <Text style={styles.statLabel}>Graded</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#f59e0b" }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {mySubmissions.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No submissions yet</Text>
          <Text style={styles.emptySubtext}>
            You haven't submitted any coursework. Check your enrolled courses for assignments.
          </Text>
        </View>
      ) : (
        <FlatList
          data={mySubmissions}
          keyExtractor={s => s.id}
          refreshing={loading}
          onRefresh={() => student?.uid && dispatch(fetchMySubmissions(student.uid))}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => <SubmissionCard submission={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563eb",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#64748b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
});
