import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, toggleFavourite, persistFavourites, saveFavouriteToCloud, removeFavouriteFromCloud } from '../../store/coursesSlice';
import { fetchMySubmissions } from '../../store/worksSlice';
import CourseCard from '../../components/CourseCard';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { courses, favourites, loading } = useSelector(state => state.courses);
  const { mySubmissions } = useSelector(state => state.works);
  const user = useSelector(state => state.auth.user);
  const [query, setQuery] = useState("");

  // Count new notifications (graded submissions)
  const newNotifications = mySubmissions.filter(sub => sub.status === 'graded').length;

  useEffect(() => {
    dispatch(fetchCourses());
    if (user?.uid) {
      dispatch(fetchMySubmissions(user.uid));
    }
  }, [user]);

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase()) ||
    (c.code || "").toLowerCase().includes(query.toLowerCase())
  );

  const toggleFav = (item) => {
    const isFav = favourites.some(c => c.id === item.id);

    dispatch(toggleFavourite(item));
    dispatch(persistFavourites(
      isFav ? favourites.filter(c => c.id !== item.id)
            : [...favourites, item]
    ));

    // Sync to cloud if user is logged in
    if (user?.uid) {
      if (isFav) {
        dispatch(removeFavouriteFromCloud({ uid: user.uid, courseId: item.id }));
      } else {
        dispatch(saveFavouriteToCloud({ uid: user.uid, course: item }));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="book-open" size={28} color="#10b981" />
          <Text style={styles.title}>Browse Courses</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Feather name="bell" size={24} color="#64748b" />
          {newNotifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{newNotifications}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          placeholder="Search courses..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={filteredCourses.length === 0 && styles.emptyList}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              isFavourite={!!favourites.find(c => c.id === item.id)}
              onToggleFavourite={() => toggleFav(item)}
              onPress={() => navigation.navigate("Details", { course: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="book" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {query ? "No courses found" : "No courses available"}
              </Text>
              <Text style={styles.emptySubtext}>
                {query ? "Try a different search term" : "Check back later for new courses"}
              </Text>
            </View>
          }
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
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
