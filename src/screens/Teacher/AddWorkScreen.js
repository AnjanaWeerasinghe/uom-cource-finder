import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { addCourseWork } from "../../store/worksSlice";
import { fetchCourses } from "../../store/coursesSlice";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddWorkScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { courses, loading } = useSelector(state => state.courses);
  
  // Get course info from route params (when navigating from specific course)
  const { courseId: routeCourseId, courseTitle: routeCourseTitle } = route?.params || {};
  
  // Show all courses for teachers to create coursework
  const availableCourses = courses || [];
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Pre-select course if coming from specific course screen
  useEffect(() => {
    console.log('AddWorkScreen - Route params:', { routeCourseId, routeCourseTitle });
    console.log('AddWorkScreen - Available courses:', availableCourses.length);
    
    if (routeCourseId && routeCourseTitle) {
      // First try to find in loaded courses
      const foundCourse = availableCourses.find(course => course.id === routeCourseId);
      
      if (foundCourse) {
        console.log('AddWorkScreen - Found course in list:', foundCourse);
        setSelectedCourse(foundCourse);
      } else {
        // If not found, create a temporary course object
        const tempCourse = {
          id: routeCourseId,
          title: routeCourseTitle
        };
        console.log('AddWorkScreen - Using temp course object:', tempCourse);
        setSelectedCourse(tempCourse);
      }
    }
  }, [routeCourseId, routeCourseTitle, availableCourses]);

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* App Bar */}
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.appBarContent}>
            <Text style={styles.appBarTitle}>Add Course Work</Text>
            <Text style={styles.appBarSubtitle}>Create new assignment</Text>
          </View>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSubmit}
          >
            <Feather name="check" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Course *</Text>
          {selectedCourse && (
            <View style={styles.selectedCourseInfo}>
              <Feather name="check-circle" size={16} color="#10b981" />
              <Text style={styles.selectedCourseText}>
                Selected: {selectedCourse.title}
                {selectedCourse.code ? ` (${selectedCourse.code})` : ''}
              </Text>
            </View>
          )}
          {availableCourses.length === 0 ? (
            <View style={styles.emptyCourses}>
              <Text style={styles.emptyCoursesText}>No courses available. Create a course first.</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseScroll}>
              {availableCourses.map(course => (
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
                  {course.code && (
                    <Text style={[
                      styles.courseChipCode,
                      selectedCourse?.id === course.id && styles.courseChipCodeSelected
                    ]}>
                      {course.code}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
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

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#10b981",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#10b981",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  appBarContent: {
    flex: 1,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  appBarSubtitle: {
    fontSize: 14,
    color: "#d1fae5",
    marginTop: 2,
  },
  saveButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  selectedCourseInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#f0fdf4",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  selectedCourseText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
  },
  emptyCourses: {
    padding: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  emptyCoursesText: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
  },
  courseChipCode: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 2,
  },
  courseChipCodeSelected: {
    color: "#059669",
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
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: 120,
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
});
