import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList, SafeAreaView } from 'react-native';
import { SharedHeader } from '../../components/SharedHeader';

// 1. Interfaces to fix TypeScript "any" errors
interface Recipe {
  id: string;
  name: string;
  image: string;
}

interface RecipeItemProps {
  name: string;
  image: string;
}

const DATA: Recipe[] = [
  { id: '1', name: 'Arroz caldo', image: 'https://placehold.co/150x150.png' },
  { id: '2', name: 'Garlic rice', image: 'https://placehold.co/150x150.png' },
  { id: '3', name: 'Sisig', image: 'https://placehold.co/150x150.png' },
  { id: '4', name: 'Binagoongan', image: 'https://placehold.co/150x150.png' },
];

const RecipeItem = ({ name, image }: RecipeItemProps) => (
  <View style={styles.recipeCard}>
    <Image source={{ uri: image }} style={styles.thumb} />
    <Text style={styles.recipeName}>{name}</Text>
  </View>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.heroWrapper}>
          <Image source={{ uri: 'https://placehold.co/600x400.png' }} style={styles.heroImg} />
        </View>
        
        <Text style={styles.sectionTitle}>Newly Recipes added {'>'}</Text>
        <FlatList 
          horizontal 
          showsHorizontalScrollIndicator={false}
          data={DATA} 
          keyExtractor={(item)=>item.id} 
          renderItem={({item}) => <RecipeItem name={item.name} image={item.image}/>} 
        />

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Rice dishes {'>'}</Text>
        <FlatList 
          horizontal 
          showsHorizontalScrollIndicator={false}
          data={DATA} 
          keyExtractor={(item)=>item.id} 
          renderItem={({item}) => <RecipeItem name={item.name} image={item.image}/>} 
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFBA74' },
  scrollPadding: { paddingBottom: 100 },
  heroWrapper: { margin: 20, height: 220, borderRadius: 20, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginBottom: 15, fontFamily: 'serif' },
  recipeCard: { marginLeft: 20, alignItems: 'center', width: 100 },
  thumb: { width: 100, height: 100, borderRadius: 15 },
  recipeName: { marginTop: 8, fontFamily: 'serif', fontSize: 13, textAlign: 'center' }
});