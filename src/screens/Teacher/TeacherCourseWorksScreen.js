import React, { useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseWorks } from "../../store/worksSlice";
import WorkCard from "../../components/WorkCard";
import { Feather } from "@expo/vector-icons";

export default function TeacherCourseWorksScreen({ route, navigation }) {
  const { courseId, courseTitle } = route.params;
  const dispatch = useDispatch();
  const { works, loading } = useSelector(s => s.works);

  useEffect(() => {
    dispatch(fetchCourseWorks(courseId));
  }, [courseId, dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddWork", { courseId, courseTitle })}
      >
        <Feather name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Work</Text>
      </TouchableOpacity>

      {works.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No works yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "Add Work" to create your first assignment
          </Text>
        </View>
      ) : (
        <FlatList
          data={works}
          keyExtractor={w => w.id}
          refreshing={loading}
          onRefresh={() => dispatch(fetchCourseWorks(courseId))}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <WorkCard
              work={item}
              onPress={() => navigation.navigate("WorkSubmissions", { work: item })}
            />
          )}
        />
      )}
    </View>
  </SafeAreaView>
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
  addButton: {
    backgroundColor: "#2563eb",
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
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
