import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { db } from "../api/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function AdminScreen() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  const handleAddCourse = async () => {
    // Validation
    if (!title || !code || !description || !category || !price || !duration) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "courses"), {
        title,
        code,
        description,
        category,
        price: Number(price),
        thumbnail: thumbnail || "https://via.placeholder.com/400",
        duration,
        status,
        rating: 0,
        students: 0,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Course added successfully!");

      // Clear form
      setTitle("");
      setCode("");
      setDescription("");
      setCategory("");
      setPrice("");
      setThumbnail("");
      setDuration("");
      setStatus("Active");
    } catch (error) {
      console.error("Error adding course:", error);
      Alert.alert("Error", "Failed to add course: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Feather name="settings" size={32} color="#007AFF" />
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Add New Course</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Introduction to Computer Science"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course Code *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., CS101"
            value={code}
            onChangeText={setCode}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter course description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Computer Science, Web Development"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (LKR) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 15000"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 12 weeks"
            value={duration}
            onChangeText={setDuration}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Thumbnail URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/image.jpg (optional)"
            value={thumbnail}
            onChangeText={setThumbnail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[
                styles.statusBtn,
                status === "Active" && styles.statusBtnActive,
              ]}
              onPress={() => setStatus("Active")}
            >
              <Text
                style={[
                  styles.statusBtnText,
                  status === "Active" && styles.statusBtnTextActive,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusBtn,
                status === "Popular" && styles.statusBtnActive,
              ]}
              onPress={() => setStatus("Popular")}
            >
              <Text
                style={[
                  styles.statusBtnText,
                  status === "Popular" && styles.statusBtnTextActive,
                ]}
              >
                Popular
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusBtn,
                status === "Upcoming" && styles.statusBtnActive,
              ]}
              onPress={() => setStatus("Upcoming")}
            >
              <Text
                style={[
                  styles.statusBtnText,
                  status === "Upcoming" && styles.statusBtnTextActive,
                ]}
              >
                Upcoming
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addButton, loading && styles.addButtonDisabled]}
          onPress={handleAddCourse}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="plus-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Course</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  statusButtons: {
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
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  statusBtnText: {
    fontSize: 14,
    color: "#666",
  },
  statusBtnTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
