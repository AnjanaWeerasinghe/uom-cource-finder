import React, { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, Text, Alert, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateCourse, fetchCourses } from "../../store/coursesSlice";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditCourseScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(s => s.courses);
  const { course } = route.params;

  const [form, setForm] = useState({
    title: course.title || "",
    code: course.code || "",
    description: course.description || "",
    category: course.category || "",
    thumbnail: course.thumbnail || "",
    price: String(course.price || ""),
    status: course.status || "Active",
    duration: course.duration || "",
    startDate: course.startDate ? new Date(course.startDate) : new Date(),
    endDate: course.endDate ? new Date(course.endDate) : new Date(new Date().setMonth(new Date().getMonth() + 3))
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setForm(prev => ({ ...prev, startDate: selectedDate }));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setForm(prev => ({ ...prev, endDate: selectedDate }));
    }
  };

  const submit = async () => {
    if (!form.title || !form.description || !form.category || !form.price || !form.duration) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (form.endDate <= form.startDate) {
      Alert.alert("Validation Error", "End date must be after start date");
      return;
    }

    try {
      const courseData = {
        ...form,
        startDate: form.startDate.toISOString(),
        endDate: form.endDate.toISOString()
      };
      await dispatch(updateCourse({ id: course.id, data: courseData })).unwrap();
      Alert.alert("Success", "Course updated successfully!");
      await dispatch(fetchCourses());
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error || "Failed to update course");
    }
  };

  const statusOptions = ["Active", "Popular", "Upcoming"];

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Course</Text>
          <View style={{ width: 24 }} />
        </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course Title *</Text>
          <TextInput
            placeholder="e.g., Introduction to Computer Science"
            value={form.title}
            onChangeText={v => onChange("title", v)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course Code *</Text>
          <TextInput
            placeholder="e.g., CS101"
            value={form.code}
            onChangeText={v => onChange("code", v)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            placeholder="Enter course description"
            value={form.description}
            onChangeText={v => onChange("description", v)}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            placeholder="e.g., Computer Science, Web Development"
            value={form.category}
            onChangeText={v => onChange("category", v)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (LKR) *</Text>
          <TextInput
            placeholder="e.g., 15000"
            value={form.price}
            onChangeText={v => onChange("price", v)}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration *</Text>
          <TextInput
            placeholder="e.g., 12 weeks"
            value={form.duration}
            onChangeText={v => onChange("duration", v)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Feather name="calendar" size={20} color="#666" />
            <Text style={styles.dateButtonText}>
              {form.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={form.startDate}
              mode="date"
              display="default"
              onChange={onStartDateChange}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Feather name="calendar" size={20} color="#666" />
            <Text style={styles.dateButtonText}>
              {form.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={form.endDate}
              mode="date"
              display="default"
              onChange={onEndDateChange}
              minimumDate={form.startDate}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Thumbnail URL</Text>
          <TextInput
            placeholder="https://example.com/image.jpg (optional)"
            value={form.thumbnail}
            onChangeText={v => onChange("thumbnail", v)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusBtn,
                  form.status === status && styles.statusBtnActive
                ]}
                onPress={() => onChange("status", status)}
              >
                <Text style={[
                  styles.statusBtnText,
                  form.status === status && styles.statusBtnTextActive
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={submit}
          disabled={loading}
        >
          <Feather name="check" size={20} color="#fff" />
          <Text style={styles.submitBtnText}>
            {loading ? "Updating..." : "Update Course"}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  statusContainer: {
    flexDirection: "row",
    gap: 10,
  },
  statusBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  statusBtnActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  statusBtnText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statusBtnTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  submitBtnDisabled: {
    backgroundColor: "#ccc",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
});
