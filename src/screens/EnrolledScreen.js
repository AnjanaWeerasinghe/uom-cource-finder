import React, { useEffect } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments } from "../store/coursesSlice";
import CourseCard from "../components/CourseCard";
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
      <FlatList
        data={enrollments}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => navigation.navigate("Details", { course: item })}
            isFavourite={false}
            onToggleFavourite={() => {}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#64748b",
    marginTop: 12,
    letterSpacing: -0.2,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 18,
  },
});
