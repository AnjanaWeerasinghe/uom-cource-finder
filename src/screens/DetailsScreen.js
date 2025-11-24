import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavourite, persistFavourites, saveFavouriteToCloud, removeFavouriteFromCloud, enrollCourse } from '../store/coursesSlice';
import { Feather } from '@expo/vector-icons';

export default function DetailsScreen({ route }) {
  const { course } = route.params;
  const dispatch = useDispatch();
  const { favourites, enrollments } = useSelector(state => state.courses);
  const user = useSelector(state => state.auth.user);

  const isFav = favourites.some(c => c.id === course.id);
  const isEnrolled = enrollments.some(e => e.id === course.id);

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

  const handleEnroll = async () => {
    if (!user?.uid) {
      Alert.alert("Login Required", "Please login to enroll in courses");
      return;
    }

    if (isEnrolled) {
      Alert.alert("Already Enrolled", "You are already enrolled in this course");
      return;
    }

    try {
      await dispatch(enrollCourse({ uid: user.uid, course })).unwrap();
      Alert.alert("Success", "You have successfully enrolled in this course!");
    } catch (error) {
      Alert.alert("Error", "Failed to enroll in course");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: course.thumbnail }} style={styles.image} />

      <View style={styles.header}>
        <Text style={styles.title}>{course.title}</Text>
        <TouchableOpacity onPress={toggleFav}>
          <Feather name="star" size={26} color={isFav ? "#fbbf24" : "#666"} />
        </TouchableOpacity>
      </View>

      {course.code && <Text style={styles.code}>{course.code}</Text>}
      <Text style={styles.category}>Category: {course.category}</Text>

      <Text style={styles.description}>{course.description}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Feather name="clock" size={18} color="#666" />
          <Text style={styles.infoText}>{course.duration}</Text>
        </View>
        {course.rating > 0 && (
          <View style={styles.infoItem}>
            <Feather name="star" size={18} color="#fbbf24" />
            <Text style={styles.infoText}>{course.rating} / 5</Text>
          </View>
        )}
        {course.students > 0 && (
          <View style={styles.infoItem}>
            <Feather name="users" size={18} color="#666" />
            <Text style={styles.infoText}>{course.students} students</Text>
          </View>
        )}
      </View>

      <Text style={styles.price}>Rs {course.price?.toLocaleString()}</Text>

      {user?.role !== "admin" && (
        <TouchableOpacity
          style={[styles.enrollBtn, isEnrolled && styles.enrolledBtn]}
          onPress={handleEnroll}
          disabled={isEnrolled}
        >
          <Feather name={isEnrolled ? "check-circle" : "play-circle"} size={20} color="#fff" />
          <Text style={styles.enrollBtnText}>
            {isEnrolled ? "Already Enrolled" : "Enroll Now"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16,
    backgroundColor: "#fff",
  },
  image: { 
    width: "100%", 
    height: 250, 
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 16,
    alignItems: "flex-start",
  },
  title: { 
    fontSize: 22, 
    fontWeight: "700", 
    flex: 1,
    marginRight: 12,
  },
  code: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
    marginTop: 6,
  },
  category: { 
    marginTop: 6, 
    color: "#777",
    fontSize: 14,
  },
  description: { 
    marginTop: 14, 
    fontSize: 16, 
    lineHeight: 24,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  price: { 
    marginTop: 16, 
    fontSize: 24, 
    fontWeight: "700",
    color: "#2563eb",
  },
  enrollBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  enrolledBtn: {
    backgroundColor: "#10b981",
  },
  enrollBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
