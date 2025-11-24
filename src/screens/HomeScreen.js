import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, toggleFavourite, persistFavourites, saveFavouriteToCloud, removeFavouriteFromCloud } from '../store/coursesSlice';
import CourseCard from '../components/CourseCard';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { courses, favourites, loading } = useSelector(state => state.courses);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(fetchCourses());
  }, []);

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
    <View style={{ flex: 1, padding: 16 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={courses}
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
