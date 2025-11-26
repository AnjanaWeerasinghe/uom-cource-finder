import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import CourseCard from '../../components/CourseCard';
import { Feather } from '@expo/vector-icons';

export default function FavouritesScreen({ navigation }) {
  const { favourites } = useSelector(state => state.courses);

  if (favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="star" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No Favourites Yet</Text>
        <Text style={styles.emptySubtext}>
          Add courses to your favourites to see them here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favourites}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            isFavourite={true}
            onToggleFavourite={() => {}}
            onPress={() => navigation.navigate("Details", { course: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
