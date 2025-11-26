import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addCourseWork } from "../../store/worksSlice";
import { fetchCourses } from "../../store/coursesSlice";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddWorkScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { courses } = useSelector(state => state.courses);
  
  // Filter to show only teacher's courses
  const teacherCourses = courses.filter(course => course.teacherId === user?.uid);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!selectedCourse) {
      Alert.alert("Error", "Please select a course");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    try {
      await dispatch(addCourseWork({
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        teacherId: user.uid,
        teacherName: user.name || user.email,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate.toISOString(),
      })).unwrap();

      Alert.alert("Success", "Course work added successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to add course work");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Feather name="plus-circle" size={28} color="#10b981" />
          <Text style={styles.title}>Add Course Work</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Course *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseScroll}>
            {teacherCourses.map(course => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseChip,
                  selectedCourse?.id === course.id && styles.courseChipSelected
                ]}
                onPress={() => setSelectedCourse(course)}
              >
                <Text style={[
                  styles.courseChipText,
                  selectedCourse?.id === course.id && styles.courseChipTextSelected
                ]}>
                  {course.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Work Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Assignment 1: Data Structures"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter work description and requirements..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Feather name="calendar" size={20} color="#666" />
            <Text style={styles.dateButtonText}>
              {dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Feather name="check" size={20} color="#fff" />
          <Text style={styles.submitButtonText}>Add Course Work</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  courseScroll: {
    marginTop: 8,
  },
  courseChip: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  courseChipSelected: {
    backgroundColor: "#dcfce7",
    borderColor: "#10b981",
  },
  courseChipText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  courseChipTextSelected: {
    color: "#10b981",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8fafc",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8fafc",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#1e293b",
  },
  submitButton: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
