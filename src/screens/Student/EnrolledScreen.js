import React, { useEffect } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments } from "../../store/coursesSlice";
import CourseCard from "../../components/CourseCard";
import { Feather } from "@expo/vector-icons";

export default function EnrolledScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);
  const enrollments = useSelector(s => s.courses.enrollments || []);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchEnrollments(user.uid));
    }
  }, [user?.uid, dispatch]);

  if (!enrollments.length) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="book-open" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No Enrollments Yet</Text>
        <Text style={styles.emptySubtext}>
          Browse courses and enroll to start learning
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Courses</Text>
        <Text style={styles.headerSubtitle}>
          {enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled
        </Text>
      </View>
      
      <FlatList
        data={enrollments}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              if (user?.uid) {
                dispatch(fetchEnrollments(user.uid));
              }
            }}
            colors={["#2563eb"]}
            tintColor="#2563eb"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <CourseCard
              course={item}
              onPress={() => navigation.navigate("Details", { course: item })}
              isFavourite={false}
              onToggleFavourite={() => {}}
            />
            
            {/* Coursework Access Button */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.courseworkBtn}
                onPress={() => navigation.navigate("StudentCourseWorks", {
                  courseId: item.id,
                  courseTitle: item.title
                })}
              >
                <Feather name="file-text" size={16} color="#fff" />
                <Text style={styles.courseworkBtnText}>View Coursework</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.submissionsBtn}
                onPress={() => navigation.navigate("MySubmissions", {
                  courseId: item.id,
                  courseTitle: item.title
                })}
              >
                <Feather name="upload" size={16} color="#fff" />
                <Text style={styles.submissionsBtnText}>My Submissions</Text>
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  listContainer: {
    paddingTop: 8,
  },
  courseItem: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  courseworkBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  courseworkBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  submissionsBtn: {
    flex: 1,
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  submissionsBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
