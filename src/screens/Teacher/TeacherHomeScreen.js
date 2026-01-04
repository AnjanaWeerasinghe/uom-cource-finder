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
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  calendarSection: {
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 8,
    padding: 14,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.1,
  },
  dateCard: {
    backgroundColor: "#dcfce7",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10b981",
  },
  dateText: {
    fontSize: 12,
    color: "#059669",
    marginTop: 2,
    fontWeight: "500",
  },
  deadlinesSection: {
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 8,
    padding: 14,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  deadlineCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: "#fbbf24",
  },
  deadlineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
    letterSpacing: -0.1,
  },
  deadlineCourse: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 1,
    fontWeight: "500",
  },
  deadlineDate: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deadlineDateText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#f59e0b",
  },
  coursesSection: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  courseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#f1f5f9",
  },
  thumbnail: {
    width: "100%",
    height: 140,
    backgroundColor: "#f1f5f9",
  },
  cardContent: {
    padding: 14,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  courseCode: {
    fontSize: 11,
    color: "#10b981",
    fontWeight: "600",
    marginBottom: 6,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  courseDescription: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  viewWorks: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
    textAlign: "center",
  },
});
