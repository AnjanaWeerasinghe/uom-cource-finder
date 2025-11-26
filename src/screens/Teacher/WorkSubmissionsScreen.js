import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubmissionsByWork, gradeSubmission } from "../../store/worksSlice";

export default function WorkSubmissionsScreen({ route, navigation }) {
  const { work } = route.params;
  const dispatch = useDispatch();
  const { submissions, loading } = useSelector(state => state.works);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    dispatch(fetchSubmissionsByWork(work.id));
  }, [dispatch, work.id]);

  const handleGrade = async () => {
    if (!grade.trim()) {
      Alert.alert("Error", "Please enter a grade");
      return;
    }

    try {
      await dispatch(gradeSubmission({
        submissionId: selectedSubmission.id,
        grade: grade.trim(),
        feedback: feedback.trim()
      })).unwrap();

      Alert.alert("Success", "Submission graded successfully");
      setGradeModalVisible(false);
      setGrade("");
      setFeedback("");
      setSelectedSubmission(null);
      dispatch(fetchSubmissionsByWork(work.id));
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to grade submission");
    }
  };

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || "");
    setFeedback(submission.feedback || "");
    setGradeModalVisible(true);
  };

  const getStatusColor = (status) => {
    return status === "graded" ? "#10b981" : "#f59e0b";
  };

  const renderSubmissionItem = ({ item }) => (
    <View style={styles.submissionCard}>
      <View style={styles.submissionHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.studentName?.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.studentEmail}>{item.studentEmail}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status === "graded" ? "Graded" : "Pending"}
          </Text>
        </View>
      </View>

      <View style={styles.submissionContent}>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color="#64748b" />
          <Text style={styles.infoText}>
            Submitted: {new Date(item.submittedAt).toLocaleDateString()}
          </Text>
        </View>

        {item.textAnswer && (
          <View style={styles.answerSection}>
            <Text style={styles.answerLabel}>Answer:</Text>
            <Text style={styles.answerText}>{item.textAnswer}</Text>
          </View>
        )}

        {item.fileUrl && (
          <View style={styles.infoRow}>
            <Feather name="file" size={16} color="#2563eb" />
            <Text style={styles.linkText}>Attached File</Text>
          </View>
        )}

        {item.status === "graded" && (
          <View style={styles.gradeSection}>
            <View style={styles.gradeRow}>
              <Feather name="award" size={18} color="#10b981" />
              <Text style={styles.gradeText}>Grade: {item.grade}</Text>
            </View>
            {item.feedback && (
              <View style={styles.feedbackSection}>
                <Text style={styles.feedbackLabel}>Feedback:</Text>
                <Text style={styles.feedbackText}>{item.feedback}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.gradeButton}
        onPress={() => openGradeModal(item)}
      >
        <Feather name={item.status === "graded" ? "edit-2" : "check-circle"} size={18} color="#fff" />
        <Text style={styles.gradeButtonText}>
          {item.status === "graded" ? "Edit Grade" : "Grade Submission"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{work.title}</Text>
          <Text style={styles.headerSubtitle}>{work.courseTitle}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{submissions.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {submissions.filter(s => s.status === "graded").length}
          </Text>
          <Text style={styles.statLabel}>Graded</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {submissions.filter(s => s.status === "submitted").length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading submissions...</Text>
        </View>
      ) : submissions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No submissions yet</Text>
          <Text style={styles.emptySubtext}>
            Students haven't submitted their work for this assignment
          </Text>
        </View>
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={item => item.id}
          renderItem={renderSubmissionItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        visible={gradeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setGradeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Grade Submission</Text>
              <TouchableOpacity onPress={() => setGradeModalVisible(false)}>
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedSubmission && (
              <View style={styles.modalBody}>
                <Text style={styles.modalStudentName}>{selectedSubmission.studentName}</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Grade *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., A, B+, 85/100"
                    value={grade}
                    onChangeText={setGrade}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Feedback (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Provide feedback to the student"
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleGrade}>
                  <Text style={styles.submitButtonText}>Submit Grade</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  studentEmail: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  submissionContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#64748b",
  },
  linkText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
  answerSection: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
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
    marginTop: 8,
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
  feedbackSection: {
    marginTop: 8,
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
  gradeButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  gradeButtonText: {
    color: "#fff",
    fontSize: 14,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  modalBody: {
    padding: 20,
  },
  modalStudentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1e293b",
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
