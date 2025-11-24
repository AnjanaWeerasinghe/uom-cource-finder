import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function CourseCard({ course, onPress, isFavourite, onToggleFavourite }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: course.thumbnail }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{course.description}</Text>

        <View style={styles.footer}>
          <Text style={styles.tag}>Popular</Text>

          <TouchableOpacity onPress={onToggleFavourite}>
            <Feather name={isFavourite ? "star" : "star"} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  image: { width: 90, height: 90, borderRadius: 10 },
  content: { flex: 1, marginLeft: 10 },
  title: { fontSize: 16, fontWeight: "700" },
  desc: { color: "#555", marginTop: 4 },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: { color: "#10b981", fontWeight: "600" },
});
