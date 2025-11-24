import React, { useEffect } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollmentsByCourse } from "../../store/coursesSlice";
import { Feather } from "@expo/vector-icons";

export default function CourseEnrollmentsScreen({ route }) {
  const { courseId, courseTitle } = route.params;
  const dispatch = useDispatch();

  const { courseEnrollments, loading } = useSelector(s => s.courses);

  useEffect(() => {
    console.log('🔍 Fetching enrollments for courseId:', courseId);
    dispatch(fetchEnrollmentsByCourse(courseId));
  }, [courseId, dispatch]);

  useEffect(() => {
    console.log('📊 Course Enrollments:', courseEnrollments.length, courseEnrollments);
  }, [courseEnrollments]);

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Feather name="book-open" size={32} color="#2563eb" />
        <Text style={styles.title}>{courseTitle}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Feather name="users" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{courseEnrollments.length}</Text>
          <Text style={styles.statLabel}>
            Student{courseEnrollments.length !== 1 ? 's' : ''} Enrolled
          </Text>
        </View>
      </View>

      {courseEnrollments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="user-x" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No Enrollments Yet</Text>
          <Text style={styles.emptySubtext}>
            This course has no enrolled students
          </Text>
        </View>
      ) : (
        <FlatList
          data={courseEnrollments}
          keyExtractor={i => i.id}
          refreshing={loading}
          onRefresh={() => dispatch(fetchEnrollmentsByCourse(courseId))}
          ListHeaderComponent={
            <Text style={styles.listHeader}>Enrolled Students</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.studentHeader}>
                <View style={styles.avatar}>
                  <Feather name="user" size={24} color="#2563eb" />
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.name}>{item.userName}</Text>
                  <Text style={styles.email}>{item.userEmail}</Text>
                </View>
              </View>
              
              <View style={styles.enrollmentMeta}>
                <Feather name="calendar" size={14} color="#666" />
                <Text style={styles.date}>
                  Enrolled: {new Date(item.enrolledAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerSection: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    textAlign: "center",
    color: "#333",
  },
  statsCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: "#10b981",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  studentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  enrollmentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
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
