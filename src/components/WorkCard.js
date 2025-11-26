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
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  meta: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
    lineHeight: 18,
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
  },
  dueDate: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  overdue: {
    color: "#ef4444",
  },
  courseTitle: {
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
    flex: 1,
    textAlign: "right",
  },
});
