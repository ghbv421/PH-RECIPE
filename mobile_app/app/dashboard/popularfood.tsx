import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView } from 'react-native';
import { SharedHeader } from '../../components/SharedHeader';

export default function PopularViewedScreen({ title = "Popular Food Recipes" }) {
  const DATA = [
    { id: '1', name: 'Garlic Rice', image: 'https://placehold.co/300x300.png' },
    { id: '2', name: 'Arroz Caldo', image: 'https://placehold.co/300x300.png' },
    { id: '3', name: 'Sisig', image: 'https://placehold.co/300x300.png' },
    { id: '4', name: 'Lechon', image: 'https://placehold.co/300x300.png' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader />
      <FlatList
        data={DATA}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<Text style={styles.title}>{title}</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.img} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFB347' },
  title: { fontSize: 24, fontWeight: 'bold', fontFamily: 'serif', paddingVertical: 20, paddingHorizontal: 5 },
  listPadding: { paddingHorizontal: 15, paddingBottom: 120 },
  row: { justifyContent: 'space-between' },
  card: { backgroundColor: '#FFF', width: '48%', borderRadius: 15, paddingBottom: 12, marginBottom: 15, alignItems: 'center', elevation: 4 },
  img: { width: '100%', height: 150, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  name: { marginTop: 10, fontWeight: 'bold', fontFamily: 'serif', textAlign: 'center' },
});