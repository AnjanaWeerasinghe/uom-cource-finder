import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { submitWork } from "../../store/worksSlice";
import { Feather } from "@expo/vector-icons";

export default function SubmitWorkScreen({ route, navigation }) {
  const { work } = route.params;
  const student = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const [answer, setAnswer] = useState("");

  const submit = async () => {
    if (!answer.trim()) {
      Alert.alert("Error", "Please enter your answer");
      return;
    }

    try {
      await dispatch(submitWork({ work, student, textAnswer: answer }));
      Alert.alert("Success", "Your work has been submitted!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to submit work");
    }
  };

  const isOverdue = work.dueDate && new Date(work.dueDate) < new Date();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Submit Work</Text>
        </View>
      </View>

      <View style={styles.workInfoCard}>
        <Text style={styles.workTitle}>{work.title}</Text>
        
        <View style={styles.infoRow}>
          <Feather name="book" size={16} color="#2563eb" />
          <Text style={styles.infoText}>{work.courseTitle}</Text>
        </View>

        {work.teacherName && (
          <View style={styles.infoRow}>
            <Feather name="user" size={16} color="#2563eb" />
            <Text style={styles.infoText}>by {work.teacherName}</Text>
          </View>
        )}

        {work.dueDate && (
          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color={isOverdue ? "#ef4444" : "#2563eb"} />
            <Text style={[styles.infoText, isOverdue && styles.overdueText]}>
              Due: {new Date(work.dueDate).toLocaleDateString()}
            </Text>
            {isOverdue && (
              <View style={styles.overdueTag}>
                <Text style={styles.overdueTagText}>OVERDUE</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {work.description && (
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionLabel}>Assignment Description</Text>
          <Text style={styles.descriptionText}>{work.description}</Text>
        </View>
      )}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Your Submission</Text>

        <Text style={styles.inputLabel}>Answer *</Text>
        <TextInput
          placeholder="Type your answer here..."
          value={answer}
          onChangeText={setAnswer}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          style={styles.textArea}
        />

        <TouchableOpacity style={styles.submitButton} onPress={submit}>
          <Feather name="send" size={20} color="#fff" />
          <Text style={styles.submitButtonText}>Submit Work</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
  workInfoCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  workTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#64748b",
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
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
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
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
