import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorksByCourse, fetchMySubmissions } from "../../store/worksSlice";

export default function CourseWorksScreen({ route, navigation }) {
  const { course } = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { works, mySubmissions, loading } = useSelector(state => state.works);

  useEffect(() => {
    dispatch(fetchWorksByCourse(course.id));
    if (user?.uid) {
      dispatch(fetchMySubmissions(user.uid));
    }
  }, [dispatch, course.id, user]);

  const getSubmissionStatus = (workId) => {
    const submission = mySubmissions.find(s => s.workId === workId);
    if (!submission) return null;
    return submission.status;
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const renderWorkItem = ({ item }) => {
    const submissionStatus = getSubmissionStatus(item.id);
    const overdue = isOverdue(item.dueDate);

    return (
      <TouchableOpacity
        style={styles.workCard}
        onPress={() => navigation.navigate("SubmitWork", { work: item })}
      >
        <View style={styles.workHeader}>
          <View style={styles.workIconContainer}>
            <Feather name="file-text" size={24} color="#2563eb" />
          </View>
          <View style={styles.workInfo}>
            <Text style={styles.workTitle}>{item.title}</Text>
            <Text style={styles.teacherName}>by {item.teacherName}</Text>
          </View>
          {submissionStatus && (
            <View style={[
              styles.statusBadge,
              { backgroundColor: submissionStatus === "graded" ? "#10b981" : "#f59e0b" }
            ]}>
              <Feather
                name={submissionStatus === "graded" ? "check-circle" : "clock"}
                size={14}
                color="#fff"
              />
            </View>
          )}
        </View>

        {item.description && (
          <Text style={styles.workDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.workFooter}>
          <View style={styles.dueDateContainer}>
            <Feather name="calendar" size={16} color={overdue ? "#ef4444" : "#64748b"} />
            <Text style={[styles.dueDate, overdue && styles.overdue]}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
            {overdue && !submissionStatus && (
              <Text style={styles.overdueLabel}>OVERDUE</Text>
            )}
          </View>

          {submissionStatus === "graded" && (
            <View style={styles.gradedBadge}>
              <Feather name="award" size={16} color="#10b981" />
              <Text style={styles.gradedText}>Graded</Text>
            </View>
          )}
          {submissionStatus === "submitted" && !overdue && (
            <View style={styles.submittedBadge}>
              <Feather name="check" size={16} color="#f59e0b" />
              <Text style={styles.submittedText}>Submitted</Text>
            </View>
          )}
          {!submissionStatus && (
            <TouchableOpacity
              style={[styles.submitButton, overdue && styles.submitButtonOverdue]}
              onPress={() => navigation.navigate("SubmitWork", { work: item })}
            >
              <Text style={styles.submitButtonText}>Submit Work</Text>
              <Feather name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Course Works</Text>
          <Text style={styles.headerSubtitle}>{course.title}</Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{works.length}</Text>
          <Text style={styles.summaryLabel}>Total Works</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {works.filter(w => getSubmissionStatus(w.id)).length}
          </Text>
          <Text style={styles.summaryLabel}>Submitted</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {works.filter(w => !getSubmissionStatus(w.id)).length}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading course works...</Text>
        </View>
      ) : works.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No course works yet</Text>
          <Text style={styles.emptySubtext}>
            Your teacher hasn't assigned any work for this course
          </Text>
        </View>
      ) : (
        <FlatList
          data={works}
          keyExtractor={item => item.id}
          renderItem={renderWorkItem}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  summaryContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563eb",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  workCard: {
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
  workHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  workIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  workInfo: {
    flex: 1,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  teacherName: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  workDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 12,
  },
  workFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  dueDate: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  overdue: {
    color: "#ef4444",
  },
  overdueLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonOverdue: {
    backgroundColor: "#ef4444",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  gradedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#d1fae5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gradedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  submittedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  submittedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
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
  },
});
