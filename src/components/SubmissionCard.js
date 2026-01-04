import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SubmissionCard({ submission }) {
  const isGraded = submission.status === "graded";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {submission.studentName?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{submission.studentName}</Text>
          <Text style={styles.studentEmail}>{submission.studentEmail}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isGraded ? "#10b981" : "#f59e0b" }]}>
          <Feather name={isGraded ? "check-circle" : "clock"} size={14} color="#fff" />
        </View>
      </View>

      <Text style={styles.workTitle}>{submission.workTitle}</Text>

      <View style={styles.metaRow}>
        <Feather name="calendar" size={14} color="#64748b" />
        <Text style={styles.metaText}>
          Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
        </Text>
      </View>

      {submission.textAnswer && (
        <View style={styles.answerSection}>
          <Text style={styles.answerLabel}>Answer:</Text>
          <Text style={styles.answerText} numberOfLines={3}>
            {submission.textAnswer}
          </Text>
        </View>
      )}

      {isGraded && submission.grade && (
        <View style={styles.gradeSection}>
          <View style={styles.gradeRow}>
            <Feather name="award" size={16} color="#10b981" />
            <Text style={styles.gradeText}>Grade: {submission.grade}</Text>
          </View>
          {submission.feedback && (
            <Text style={styles.feedbackText} numberOfLines={2}>
              {submission.feedback}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 18,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "#f1f5f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.1,
  },
  studentEmail: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 1,
    fontWeight: "500",
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  workTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  metaText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  answerSection: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 0.5,
    borderColor: "#f1f5f9",
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  answerText: {
    fontSize: 12,
    color: "#1e293b",
    lineHeight: 16,
  },
  gradeSection: {
    backgroundColor: "#f0fdf4",
    padding: 10,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 0.5,
    borderColor: "#dcfce7",
  },
  gradeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  gradeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10b981",
  },
  feedbackText: {
    fontSize: 11,
    color: "#064e3b",
    lineHeight: 15,
    marginTop: 4,
  },
});
