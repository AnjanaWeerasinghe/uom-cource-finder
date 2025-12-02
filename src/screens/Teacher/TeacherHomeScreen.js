import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../store/coursesSlice";
import { fetchWorksByTeacher } from "../../store/worksSlice";
import { Feather } from "@expo/vector-icons";

export default function TeacherHomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { courses, loading } = useSelector(state => state.courses);
  const { works } = useSelector(state => state.works);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter courses to show only teacher's courses
  const teacherCourses = courses.filter(course => course.teacherId === user?.uid);

  // Get upcoming works (sorted by due date)
  const upcomingWorks = works
    .filter(work => new Date(work.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  useEffect(() => {
    dispatch(fetchCourses());
    if (user?.uid) {
      dispatch(fetchWorksByTeacher(user.uid));
    }
  }, [dispatch, user]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Feather name="book-open" size={28} color="#10b981" />
        <Text style={styles.title}>Teacher Dashboard</Text>
      </View>

      {/* Calendar Section */}
      <View style={styles.calendarSection}>
        <View style={styles.sectionHeader}>
          <Feather name="calendar" size={20} color="#10b981" />
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
        </View>
        <View style={styles.dateCard}>
          <Text style={styles.dayText}>{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</Text>
          <Text style={styles.dateText}>{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
        </View>
      </View>

      {/* Upcoming Deadlines */}
      {upcomingWorks.length > 0 && (
        <View style={styles.deadlinesSection}>
          <View style={styles.sectionHeader}>
            <Feather name="clock" size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          </View>
          {upcomingWorks.map(work => (
            <TouchableOpacity
              key={work.id}
              style={styles.deadlineCard}
              onPress={() => navigation.navigate("WorkSubmissions", { work })}
            >
              <View style={styles.deadlineIcon}>
                <Feather name="file-text" size={20} color="#f59e0b" />
              </View>
              <View style={styles.deadlineInfo}>
                <Text style={styles.deadlineTitle}>{work.title}</Text>
                <Text style={styles.deadlineCourse}>{work.courseTitle}</Text>
              </View>
              <View style={styles.deadlineDate}>
                <Text style={styles.deadlineDateText}>
                  {new Date(work.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* My Courses Section */}
      <View style={styles.coursesSection}>
        <View style={styles.sectionHeader}>
          <Feather name="book" size={20} color="#10b981" />
          <Text style={styles.sectionTitle}>My Courses ({teacherCourses.length})</Text>
        </View>
        {teacherCourses.map(item => (
          <TouchableOpacity
            key={item.id}
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
        ))}
        {teacherCourses.length === 0 && (
          <View style={styles.emptyContainer}>
            <Feather name="book-open" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No courses assigned</Text>
            <Text style={styles.emptySubtext}>Contact admin to assign courses to you</Text>
          </View>
        )}
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
  calendarSection: {
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  dateCard: {
    backgroundColor: "#dcfce7",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  dayText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10b981",
  },
  dateText: {
    fontSize: 14,
    color: "#059669",
    marginTop: 4,
  },
  deadlinesSection: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  deadlineCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    marginBottom: 8,
  },
  deadlineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  deadlineCourse: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  deadlineDate: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deadlineDateText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f59e0b",
  },
  coursesSection: {
    margin: 16,
    marginTop: 8,
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
