import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView } from 'react-native';
import { SharedHeader } from '../../components/SharedHeader';
import { Ionicons } from '@expo/vector-icons';

interface Fav { id: string; name: string; image: string; }

const FAVS: Fav[] = [
  { id: '1', name: 'Garlic Rice', image: 'https://placehold.co/300x300.png' },
  { id: '2', name: 'Arroz Caldo', image: 'https://placehold.co/300x300.png' },
  { id: '3', name: 'Sinigang', image: 'https://placehold.co/300x300.png' },
  { id: '4', name: 'Adobo', image: 'https://placehold.co/300x300.png' },
];

export default function FavouritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader />
      <FlatList
        data={FAVS}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={() => (
          <View style={styles.titleRow}>
            <Text style={styles.title}>Favorites</Text>
            <Ionicons name="heart-outline" size={24} color="black" style={{ marginLeft: 8 }} />
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={styles.footer}>
              <Ionicons name="heart-outline" size={18} color="black" />
              <Text style={styles.name}>{item.name}</Text>
            </View>
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
  titleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 5 },
  title: { fontSize: 24, fontWeight: 'bold', fontFamily: 'serif' },
  listPadding: { paddingHorizontal: 15, paddingBottom: 120 },
  row: { justifyContent: 'space-between' },
  card: { backgroundColor: '#FFF', width: '48%', borderRadius: 15, padding: 8, marginBottom: 15, elevation: 3 },
  img: { width: '100%', height: 140, borderRadius: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  name: { fontSize: 14, fontWeight: '600', fontFamily: 'serif', marginLeft: 5 },
});