import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySubmissions } from "../../store/worksSlice";

export default function MySubmissionsScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { mySubmissions, loading } = useSelector(state => state.works);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchMySubmissions(user.uid));
    }
  }, [dispatch, user]);

  const renderSubmissionItem = ({ item }) => {
    const isGraded = item.status === "graded";

    return (
      <View style={styles.submissionCard}>
        <View style={styles.submissionHeader}>
          <View style={styles.courseIconContainer}>
            <Feather name="book" size={20} color="#2563eb" />
          </View>
          <View style={styles.submissionInfo}>
            <Text style={styles.courseTitle}>{item.courseId}</Text>
            <Text style={styles.workTitle}>{item.workTitle}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isGraded ? "#10b981" : "#f59e0b" }
          ]}>
            <Feather
              name={isGraded ? "check-circle" : "clock"}
              size={16}
              color="#fff"
            />
          </View>
        </View>

        <View style={styles.submissionDetails}>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={14} color="#64748b" />
            <Text style={styles.detailText}>
              Submitted: {new Date(item.submittedAt).toLocaleDateString()}
            </Text>
          </View>

          {item.textAnswer && (
            <View style={styles.answerPreview}>
              <Text style={styles.answerLabel}>Your Answer:</Text>
              <Text style={styles.answerText} numberOfLines={2}>
                {item.textAnswer}
              </Text>
            </View>
          )}

          {isGraded && (
            <View style={styles.gradeSection}>
              <View style={styles.gradeRow}>
                <Feather name="award" size={18} color="#10b981" />
                <Text style={styles.gradeText}>Grade: {item.grade}</Text>
              </View>
              {item.feedback && (
                <View style={styles.feedbackPreview}>
                  <Text style={styles.feedbackLabel}>Feedback:</Text>
                  <Text style={styles.feedbackText} numberOfLines={2}>
                    {item.feedback}
                  </Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Feather name="calendar" size={14} color="#059669" />
                <Text style={[styles.detailText, { color: "#059669" }]}>
                  Graded: {new Date(item.gradedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}

          {!isGraded && (
            <View style={styles.pendingSection}>
              <Feather name="clock" size={16} color="#f59e0b" />
              <Text style={styles.pendingText}>Waiting for teacher to grade</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

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

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading submissions...</Text>
        </View>
      ) : mySubmissions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No submissions yet</Text>
          <Text style={styles.emptySubtext}>
            You haven't submitted any coursework. Check your enrolled courses for assignments.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate("Enrolled")}
          >
            <Text style={styles.browseButtonText}>Browse Courses</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={mySubmissions}
          keyExtractor={item => item.id}
          renderItem={renderSubmissionItem}
          contentContainerStyle={styles.listContainer}
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
    padding: 20,
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
    padding: 20,
    marginBottom: 12,
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
  submissionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  submissionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  courseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  submissionInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  workTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 2,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submissionDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#64748b",
  },
  answerPreview: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    color: "#1e293b",
    lineHeight: 20,
  },
  gradeSection: {
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  gradeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gradeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10b981",
  },
  feedbackPreview: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#d1fae5",
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: "#064e3b",
    lineHeight: 20,
  },
  pendingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 8,
  },
  pendingText: {
    fontSize: 14,
    color: "#92400e",
    fontWeight: "600",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
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
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
