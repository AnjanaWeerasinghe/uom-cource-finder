import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, toggleFavourite, persistFavourites, saveFavouriteToCloud, removeFavouriteFromCloud } from '../store/coursesSlice';
import CourseCard from '../components/CourseCard';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { courses, favourites, loading } = useSelector(state => state.courses);
  const user = useSelector(state => state.auth.user);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
  }, []);

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
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          placeholder="Search courses..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              isFavourite={!!favourites.find(c => c.id === item.id)}
              onToggleFavourite={() => toggleFav(item)}
              onPress={() => navigation.navigate("Details", { course: item })}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: "#1e293b",
  },
});
