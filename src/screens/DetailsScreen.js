import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavourite, persistFavourites, saveFavouriteToCloud, removeFavouriteFromCloud } from '../store/coursesSlice';
import { Feather } from '@expo/vector-icons';

export default function DetailsScreen({ route }) {
  const { course } = route.params;
  const dispatch = useDispatch();
  const { favourites } = useSelector(state => state.courses);
  const user = useSelector(state => state.auth.user);

  const isFav = favourites.some(c => c.id === course.id);

  const toggleFav = () => {
    dispatch(toggleFavourite(course));
    dispatch(persistFavourites(
      isFav
        ? favourites.filter(c => c.id !== course.id)
        : [...favourites, course]
    ));

    // Sync to cloud if user is logged in
    if (user?.uid) {
      if (isFav) {
        dispatch(removeFavouriteFromCloud({ uid: user.uid, courseId: course.id }));
      } else {
        dispatch(saveFavouriteToCloud({ uid: user.uid, course }));
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: course.thumbnail }} style={styles.image} />

      <View style={styles.header}>
        <Text style={styles.title}>{course.title}</Text>
        <TouchableOpacity onPress={toggleFav}>
          <Feather name="star" size={26} />
        </TouchableOpacity>
      </View>

      <Text style={styles.category}>Category: {course.category}</Text>

      <Text style={styles.description}>{course.description}</Text>

      <Text style={styles.price}>Rs {course.price}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: "100%", height: 250, borderRadius: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  title: { fontSize: 22, fontWeight: "700", flex: 1 },
  category: { marginTop: 6, color: "#777" },
  description: { marginTop: 14, fontSize: 16, lineHeight: 22 },
  price: { marginTop: 14, fontSize: 20, fontWeight: "700" },
});
