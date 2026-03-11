import React from 'react';
import { StyleSheet, Text, View, FlatList, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { SharedHeader } from '../../components/SharedHeader';

interface Category { id: string; title: string; image: string; }

const CATEGORIES: Category[] = [
  { id: '1', title: 'Rice', image: 'https://placehold.co/300x300.png' },
  { id: '2', title: 'Meat', image: 'https://placehold.co/300x300.png' },
  { id: '3', title: 'Seafood', image: 'https://placehold.co/300x300.png' },
  { id: '4', title: 'VEGE', image: 'https://placehold.co/300x300.png' },
  { id: '5', title: 'Dessert', image: 'https://placehold.co/300x300.png' },
  { id: '6', title: 'Drinks', image: 'https://placehold.co/300x300.png' },
];

export default function CategoriesScreen() {
  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.card}>
      <ImageBackground source={{ uri: item.image }} style={styles.imageBg} imageStyle={{ borderRadius: 20 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader />
      <FlatList
        data={CATEGORIES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFB347' },
  listPadding: { paddingHorizontal: 15, paddingBottom: 100, paddingTop: 10 },
  row: { justifyContent: 'space-between' },
  card: { width: '48%', height: 160, marginBottom: 15 },
  imageBg: { width: '100%', height: '100%', justifyContent: 'flex-end', padding: 15 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', fontFamily: 'serif', textShadowColor: 'black', textShadowRadius: 8 },
});