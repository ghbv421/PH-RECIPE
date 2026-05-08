import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  FlatList, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity 
} from 'react-native';
import { SharedHeader } from '../../components/SharedHeader';

interface Recipe {
  id: number;
  name: string;
  image_key: string; 
  category: string;
  time: string;
  rating: number;
}

const BASE_URL = "http://10.232.207.146:8000";

const RecipeItem = ({ name, image }: { name: string; image: string }) => {
  const getFullImageUrl = (path: string) => {
    if (!path || path === "...") return 'https://placehold.co/150x150.png';
    if (path.startsWith('http')) return path;

    // Guard clause for missing extensions
    const fileName = path.includes('.') ? path : `${path}.png`;

    // ✅ Updated path to match new MEDIA_URL in Django settings
    return `${BASE_URL}/media/images/${fileName}`;
  };

  return (
    <View style={styles.recipeCard}>
      <Image 
        source={{ uri: getFullImageUrl(image) }} 
        style={styles.thumb} 
        onError={() => console.log(`Failed image link: ${getFullImageUrl(image)}`)}
      />
      <Text style={styles.recipeName}>{name}</Text>
    </View>
  );
};

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/recipes/`) 
      .then((res) => {
        if (!res.ok) throw new Error("Connection failed");
        return res.json();
      })
      .then((data) => {
        setRecipes(data); 
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load recipes.");
        setLoading(false);
      });
  }, []);

  const addRecipe = (newRecipeData: any) => {
    fetch(`${BASE_URL}/api/recipes/add/`, {
        method: "POST", 
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Token c90c32d906f7fb597d310f44a4e8d4c6bb67e50e" 
        },
        body: JSON.stringify(newRecipeData)
    })
    .then(res => res.json())
    .then(data => {
        Alert.alert("Success", "Recipe Added!");
        setRecipes(prev => [...prev, data]);
    })
    .catch(() => Alert.alert("Error", "Check your Token"));
  };

  if (loading) return <ActivityIndicator size="large" color="#000" style={{marginTop: 100}} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.heroWrapper}>
          <Image source={{ uri: 'https://placehold.co/600x400.png' }} style={styles.heroImg} />
        </View>
        
        <Text style={styles.sectionTitle}>Newly Recipes added {'>'}</Text>
        
        {recipes.length > 0 ? (
          <FlatList 
            horizontal 
            showsHorizontalScrollIndicator={false}
            data={recipes} 
            keyExtractor={(item) => item.id.toString()} 
            renderItem={({item}) => <RecipeItem name={item.name} image={item.image_key}/>} 
          />
        ) : (
          <Text style={{marginLeft: 20}}>No recipes found.</Text>
        )}

        <TouchableOpacity 
          style={styles.testBtn}
          onPress={() => addRecipe({ 
            name: "Mobile Demo", 
            category: "Rice", 
            image_key: "arroz_caldo.png", 
            time: "30", 
            rating: 4.0 
          })}
        >
          <Text>Demo Add Recipe (Task 4)</Text>
        </TouchableOpacity>
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
  recipeName: { marginTop: 8, fontFamily: 'serif', fontSize: 13, textAlign: 'center' },
  testBtn: { backgroundColor: '#fff', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 100 }
});