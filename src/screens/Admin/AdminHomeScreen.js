import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, Alert, StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, deleteCourse } from "../../store/coursesSlice";
import CourseCard from "../../components/CourseCard";
import { Feather } from "@expo/vector-icons";

export default function AdminHomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector(s => s.courses);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.code || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (courseId, courseTitle) => {
    Alert.alert(
      "Delete Course?",
      `Are you sure you want to delete "${courseTitle}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await dispatch(deleteCourse(courseId));
            Alert.alert("Success", "Course deleted successfully");
            dispatch(fetchCourses()); // Refresh list
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddCourse")}
      >
        <Feather name="plus-circle" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add New Course</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={() => dispatch(fetchCourses())}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No courses yet</Text>
            <Text style={styles.emptySubtext}>Add your first course to get started</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <CourseCard 
              course={item} 
              onPress={() => navigation.navigate("Details", { course: item })}
              isFavourite={false}
              onToggleFavourite={() => {}}
            />

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => navigation.navigate("EditCourse", { course: item })}
              >
                <Feather name="edit-2" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.enrollBtn]}
                onPress={() => navigation.navigate("CourseEnrollments", {
                  courseId: item.id,
                  courseTitle: item.title
                })}
              >
                <Feather name="users" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Enrollments</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Feather name="trash-2" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  courseItem: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  editBtn: {
    backgroundColor: "#10b981",
  },
  enrollBtn: {
    backgroundColor: "#f59e0b",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
});
