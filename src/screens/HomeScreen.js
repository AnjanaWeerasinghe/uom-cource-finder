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
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
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
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
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
});
