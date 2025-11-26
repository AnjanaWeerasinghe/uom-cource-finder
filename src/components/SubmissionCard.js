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
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  studentEmail: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  workTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
  },
  answerSection: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
  },
  answerText: {
    fontSize: 13,
    color: "#1e293b",
    lineHeight: 18,
  },
  gradeSection: {
    backgroundColor: "#f0fdf4",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  gradeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10b981",
  },
  feedbackText: {
    fontSize: 12,
    color: "#064e3b",
    lineHeight: 16,
    marginTop: 4,
  },
});
