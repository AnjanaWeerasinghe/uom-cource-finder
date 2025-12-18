import React, { useEffect } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorksByCourse } from "../../store/worksSlice";
import WorkCard from "../../components/WorkCard";
import { Feather } from "@expo/vector-icons";

export default function StudentCourseWorksScreen({ route, navigation }) {
  const { courseId, courseTitle } = route.params;
  const dispatch = useDispatch();
  const { works, loading } = useSelector(s => s.works);

  useEffect(() => {
    dispatch(fetchWorksByCourse(courseId));
  }, [courseId, dispatch]);

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

      {works.length === 0 && !loading ? (
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
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#64748b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
});
