import React, { useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../store/coursesSlice";
import { Feather } from "@expo/vector-icons";

export default function TeacherHomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { courses, loading } = useSelector(state => state.courses);

  // Filter courses to show only teacher's courses
  const teacherCourses = courses.filter(course => course.teacherId === user?.uid);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="book-open" size={28} color="#10b981" />
        <Text style={styles.title}>My Courses</Text>
      </View>

      <FlatList
        data={teacherCourses}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={() => dispatch(fetchCourses())}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => navigation.navigate("TeacherCourseWorks", { 
              courseId: item.id, 
              courseTitle: item.title 
            })}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.cardContent}>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <Text style={styles.courseCode}>{item.code}</Text>
              <Text style={styles.courseDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.footer}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.viewWorks}>View Works →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="book-open" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No courses assigned</Text>
            <Text style={styles.emptySubtext}>Contact admin to assign courses to you</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  addButton: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    margin: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  listContent: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: 180,
    backgroundColor: "#f0f0f0",
  },
  cardContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 13,
    color: "#10b981",
    fontWeight: "600",
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  viewWorks: {
    fontSize: 14,
    color: "#10b981",
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
