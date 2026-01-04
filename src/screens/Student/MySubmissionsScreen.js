import React, { useEffect } from "react";
import { View, FlatList, Text, StyleSheet, RefreshControl } from "react-native";
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
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => student?.uid && dispatch(fetchMySubmissions(student.uid))}
              colors={["#2563eb"]}
              tintColor="#2563eb"
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 14,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2563eb",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 18,
  },
});
