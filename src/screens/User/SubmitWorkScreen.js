import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { submitWork, fetchMySubmissions } from "../../store/worksSlice";

export default function SubmitWorkScreen({ route, navigation }) {
  const { work } = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { mySubmissions } = useSelector(state => state.works);

  const [textAnswer, setTextAnswer] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const existingSubmission = mySubmissions.find(s => s.workId === work.id);
  const isOverdue = new Date(work.dueDate) < new Date();

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchMySubmissions(user.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (existingSubmission) {
      setTextAnswer(existingSubmission.textAnswer || "");
      setFileUrl(existingSubmission.fileUrl || "");
    }
  }, [existingSubmission]);

  const handleSubmit = async () => {
    if (!textAnswer.trim() && !fileUrl.trim()) {
      Alert.alert("Error", "Please provide an answer or attach a file");
      return;
    }

    if (existingSubmission) {
      Alert.alert("Already Submitted", "You have already submitted work for this assignment");
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(submitWork({
        courseId: work.courseId,
        workId: work.id,
        workTitle: work.title,
        studentId: user.uid,
        studentName: user.displayName || "Student",
        studentEmail: user.email,
        textAnswer: textAnswer.trim(),
        fileUrl: fileUrl.trim()
      })).unwrap();

      Alert.alert("Success", "Your work has been submitted successfully", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to submit work");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Submit Work</Text>
          <Text style={styles.headerSubtitle}>{work.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.workInfoCard}>
          <View style={styles.infoRow}>
            <Feather name="book" size={18} color="#2563eb" />
            <Text style={styles.infoLabel}>Course:</Text>
            <Text style={styles.infoValue}>{work.courseTitle}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="user" size={18} color="#2563eb" />
            <Text style={styles.infoLabel}>Teacher:</Text>
            <Text style={styles.infoValue}>{work.teacherName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={18} color={isOverdue ? "#ef4444" : "#2563eb"} />
            <Text style={styles.infoLabel}>Due Date:</Text>
            <Text style={[styles.infoValue, isOverdue && styles.overdueText]}>
              {new Date(work.dueDate).toLocaleDateString()}
            </Text>
            {isOverdue && (
              <View style={styles.overdueTag}>
                <Text style={styles.overdueTagText}>OVERDUE</Text>
              </View>
            )}
          </View>
        </View>

        {work.description && (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionLabel}>Assignment Description</Text>
            <Text style={styles.descriptionText}>{work.description}</Text>
          </View>
        )}

        {existingSubmission ? (
          <View style={styles.submittedCard}>
            <View style={styles.submittedHeader}>
              <Feather
                name={existingSubmission.status === "graded" ? "check-circle" : "clock"}
                size={32}
                color={existingSubmission.status === "graded" ? "#10b981" : "#f59e0b"}
              />
              <View style={styles.submittedInfo}>
                <Text style={styles.submittedTitle}>
                  {existingSubmission.status === "graded" ? "Graded" : "Submitted"}
                </Text>
                <Text style={styles.submittedDate}>
                  Submitted on {new Date(existingSubmission.submittedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {existingSubmission.textAnswer && (
              <View style={styles.submittedSection}>
                <Text style={styles.submittedSectionLabel}>Your Answer:</Text>
                <Text style={styles.submittedSectionText}>{existingSubmission.textAnswer}</Text>
              </View>
            )}

            {existingSubmission.fileUrl && (
              <View style={styles.submittedSection}>
                <Text style={styles.submittedSectionLabel}>Attached File:</Text>
                <Text style={styles.fileUrlText}>{existingSubmission.fileUrl}</Text>
              </View>
            )}

            {existingSubmission.status === "graded" && (
              <View style={styles.gradeCard}>
                <View style={styles.gradeHeader}>
                  <Feather name="award" size={24} color="#10b981" />
                  <Text style={styles.gradeTitle}>Grade: {existingSubmission.grade}</Text>
                </View>
                {existingSubmission.feedback && (
                  <View style={styles.feedbackSection}>
                    <Text style={styles.feedbackLabel}>Teacher's Feedback:</Text>
                    <Text style={styles.feedbackText}>{existingSubmission.feedback}</Text>
                  </View>
                )}
                <Text style={styles.gradedDate}>
                  Graded on {new Date(existingSubmission.gradedAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Your Submission</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Answer *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Type your answer here..."
                value={textAnswer}
                onChangeText={setTextAnswer}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                editable={!existingSubmission}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>File URL (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://drive.google.com/..."
                value={fileUrl}
                onChangeText={setFileUrl}
                editable={!existingSubmission}
              />
              <Text style={styles.inputHint}>
                Upload your file to Google Drive or similar and paste the link here
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting || existingSubmission}
            >
              <Feather name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>
                {submitting ? "Submitting..." : "Submit Work"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  workInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  infoValue: {
    fontSize: 14,
    color: "#1e293b",
    flex: 1,
  },
  overdueText: {
    color: "#ef4444",
    fontWeight: "600",
  },
  overdueTag: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  overdueTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ef4444",
  },
  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
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
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1e293b",
    minHeight: 150,
  },
  inputHint: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  submittedCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  submittedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  submittedInfo: {
    flex: 1,
  },
  submittedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  submittedDate: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  submittedSection: {
    marginBottom: 16,
  },
  submittedSectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  submittedSectionText: {
    fontSize: 14,
    color: "#1e293b",
    lineHeight: 20,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
  },
  fileUrlText: {
    fontSize: 14,
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  gradeCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  gradeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  gradeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10b981",
  },
  feedbackSection: {
    marginBottom: 12,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 14,
    color: "#064e3b",
    lineHeight: 20,
  },
  gradedDate: {
    fontSize: 12,
    color: "#059669",
    fontStyle: "italic",
  },
});
