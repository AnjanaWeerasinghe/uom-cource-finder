import React, { useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* App Bar */}
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.appBarContent}>
            <Text style={styles.appBarTitle}>Course Works</Text>
            <Text style={styles.appBarSubtitle}>{courseTitle}</Text>
          </View>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate("AddWork", { courseId, courseTitle })}
          >
            <Feather name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddWork", { courseId, courseTitle })}
      >
        <Feather name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add New Assignment</Text>
      </TouchableOpacity>

      {works.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No works yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "Add New Assignment" or the + button to create your first assignment
          </Text>
        </View>
      ) : loading && works.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading course works...</Text>
        </View>
      ) : (
        <FlatList
          data={works}
          keyExtractor={w => w.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => dispatch(fetchCourseWorks(courseId))}
              colors={["#2563eb"]}
              tintColor="#2563eb"
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2563eb",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 18,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  appBarContent: {
    flex: 1,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.2,
  },
  appBarSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 1,
    fontWeight: "500",
  },
  menuButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  addButton: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 12,
    fontWeight: "500",
  },
});
