import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function WorkCard({ work, onPress }) {
  const isOverdue = work.dueDate && new Date(work.dueDate) < new Date();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather name="file-text" size={20} color="#2563eb" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{work.title}</Text>
          {work.teacherName && (
            <Text style={styles.meta}>by {work.teacherName}</Text>
          )}
        </View>
      </View>

      {work.description && (
        <Text numberOfLines={2} style={styles.description}>
          {work.description}
        </Text>
      )}

      <View style={styles.footer}>
        {work.dueDate && (
          <View style={styles.dueDateContainer}>
            <Feather name="calendar" size={14} color={isOverdue ? "#ef4444" : "#64748b"} />
            <Text style={[styles.dueDate, isOverdue && styles.overdue]}>
              Due: {new Date(work.dueDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        {work.courseTitle && (
          <Text style={styles.courseTitle} numberOfLines={1}>{work.courseTitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
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
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.1,
  },
  meta: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 1,
    fontWeight: "500",
  },
  description: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 10,
    lineHeight: 17,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dueDate: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  overdue: {
    color: "#ef4444",
  },
  courseTitle: {
    fontSize: 11,
    color: "#94a3b8",
    fontStyle: "italic",
    flex: 1,
    textAlign: "right",
    fontWeight: "500",
  },
});
