import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavourite, persistFavourites, saveFavouriteToCloud, removeFavouriteFromCloud, enrollCourse } from '../store/coursesSlice';
import { Feather } from '@expo/vector-icons';

export default function DetailsScreen({ route, navigation }) {
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
      await dispatch(enrollCourse({ user, course })).unwrap();
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

      {(course.startDate || course.endDate) && (
        <View style={styles.dateSection}>
          <View style={styles.dateSectionHeader}>
            <Feather name="calendar" size={20} color="#2563eb" />
            <Text style={styles.dateSectionTitle}>Course Schedule</Text>
          </View>
          <View style={styles.dateCards}>
            {course.startDate && (
              <View style={styles.dateCard}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <View style={styles.dateValueContainer}>
                  <Feather name="play-circle" size={16} color="#10b981" />
                  <Text style={styles.dateValue}>
                    {new Date(course.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
            )}
            {course.endDate && (
              <View style={styles.dateCard}>
                <Text style={styles.dateLabel}>End Date</Text>
                <View style={styles.dateValueContainer}>
                  <Feather name="flag" size={16} color="#f59e0b" />
                  <Text style={styles.dateValue}>
                    {new Date(course.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

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

      {isEnrolled && user?.role === "student" && (
        <TouchableOpacity
          style={styles.viewWorksBtn}
          onPress={() => navigation.navigate("CourseWorks", { course })}
        >
          <Feather name="file-text" size={20} color="#2563eb" />
          <Text style={styles.viewWorksBtnText}>View Course Works</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 12,
    backgroundColor: "#f8fafc",
  },
  image: { 
    width: "100%", 
    height: 220, 
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 12,
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "800", 
    flex: 1,
    marginRight: 10,
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  code: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "600",
    marginTop: 4,
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  category: { 
    marginTop: 4, 
    color: "#64748b",
    fontSize: 12,
    fontWeight: "500",
  },
  description: { 
    marginTop: 12, 
    fontSize: 15, 
    lineHeight: 22,
    color: "#475569",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  price: { 
    marginTop: 12, 
    fontSize: 22, 
    fontWeight: "800",
    color: "#2563eb",
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  enrollBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  enrolledBtn: {
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
  },
  enrollBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  viewWorksBtn: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#2563eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  viewWorksBtnText: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  dateSection: {
    marginTop: 12,
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dateSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  dateSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.1,
  },
  dateCards: {
    flexDirection: "row",
    gap: 8,
  },
  dateCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#f1f5f9",
  },
  dateLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
  },
});
