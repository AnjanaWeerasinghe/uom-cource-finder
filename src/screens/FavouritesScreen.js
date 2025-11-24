import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useSelector } from 'react-redux';
import CourseCard from '../components/CourseCard';

export default function FavouritesScreen({ navigation }) {
  const favourites = useSelector(state => state.courses.favourites);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {favourites.length === 0 ? (
        <Text>No favourites added yet.</Text>
      ) : (
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
      )}
    </View>
  );
}
