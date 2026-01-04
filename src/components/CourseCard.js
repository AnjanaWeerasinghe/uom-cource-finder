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
            <Feather 
              name="star" 
              size={24} 
              color={isFavourite ? "#000" : "#ccc"}
              fill={isFavourite ? "#000" : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: "#f1f5f9",
  },
  image: { 
    width: 80, 
    height: 80, 
    borderRadius: 16,
    backgroundColor: "#f8fafc",
  },
  content: { 
    flex: 1, 
    marginLeft: 14,
    justifyContent: "space-between",
  },
  title: { 
    fontSize: 16, 
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  desc: { 
    color: "#64748b", 
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: { 
    color: "#10b981", 
    fontWeight: "600",
    fontSize: 12,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
});
