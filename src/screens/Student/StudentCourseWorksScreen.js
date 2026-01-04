import React, { useEffect } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorksByCourse } from "../../store/worksSlice";
import { fetchEnrollments } from "../../store/coursesSlice";
import WorkCard from "../../components/WorkCard";
import { Feather } from "@expo/vector-icons";

export default function StudentCourseWorksScreen({ route, navigation }) {
  const { courseId, courseTitle } = route.params;
  const dispatch = useDispatch();
  const { works, loading, error } = useSelector(s => s.works);
  const { user } = useSelector(s => s.auth);
  const { enrollments } = useSelector(s => s.courses);

  const isEnrolled = enrollments.some(e => e.id === courseId);

  useEffect(() => {
    console.log('StudentCourseWorksScreen - courseId:', courseId);
    console.log('StudentCourseWorksScreen - user:', user?.role);
    console.log('StudentCourseWorksScreen - isEnrolled:', isEnrolled);
    
    // Ensure enrollments are loaded
    if (user?.uid) {
      dispatch(fetchEnrollments(user.uid));
    }
    
    dispatch(fetchWorksByCourse(courseId));
  }, [courseId, dispatch, user?.uid]);

  useEffect(() => {
    console.log('StudentCourseWorksScreen - works updated:', works.length, 'items');
    console.log('StudentCourseWorksScreen - loading:', loading);
    console.log('StudentCourseWorksScreen - error:', error);
  }, [works, loading, error]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Course Works</Text>
          <Text style={styles.headerSubtitle}>{courseTitle}</Text>
        </View>
      </View>

      {!isEnrolled ? (
        <View style={styles.emptyContainer}>
          <Feather name="alert-circle" size={64} color="#f59e0b" />
          <Text style={styles.emptyText}>Not Enrolled</Text>
          <Text style={styles.emptySubtext}>
            You need to be enrolled in this course to view coursework
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Feather name="alert-triangle" size={64} color="#ef4444" />
          <Text style={styles.emptyText}>Error Loading Works</Text>
          <Text style={styles.emptySubtext}>
            {error}
          </Text>
        </View>
      ) : works.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No works yet</Text>
          <Text style={styles.emptySubtext}>
            Your teacher hasn't assigned any work for this course
          </Text>
        </View>
      ) : (
        <FlatList
          data={works}
          keyExtractor={w => w.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => dispatch(fetchWorksByCourse(courseId))}
              colors={["#2563eb"]}
              tintColor="#2563eb"
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <WorkCard
              work={item}
              onPress={() => navigation.navigate("SubmitWork", { work: item })}
            />
          )}
        />
      )}
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 1,
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 18,
  },
});
