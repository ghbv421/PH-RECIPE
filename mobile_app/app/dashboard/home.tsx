import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image,
  FlatList, SafeAreaView, ActivityIndicator, Alert,
  TouchableOpacity, Modal, Animated, Dimensions, PanResponder
} from 'react-native';
import { SharedHeader } from '../../components/SharedHeader';
import { useRouter } from 'expo-router';

// Fix 1: Destructure Dimensions properly
const { width, height } = Dimensions.get('window');

// Fix 5: Define BASE_URL
const BASE_URL = 'https://your-api-domain.com';

// --- IMAGE MAPPER ---
const RecipeImages: { [key: string]: any } = {
  arroz_caldo: require('../../assets/images/arroz_caldo.png'),
  beef_tapa: require('../../assets/images/beef_tapa.png'),
  beefpares: require('../../assets/images/beefpares.png'),
  binagoongan: require('../../assets/images/binagoongan.png'),
  bulalo: require('../../assets/images/bulalo.png'),
  chickenadobo: require('../../assets/images/chickenadobo.png'),
  crispy_lechon: require('../../assets/images/crispy_lechon.png'),
  friedchicken: require('../../assets/images/friedchicken.png'),
  garlic_rice: require('../../assets/images/garlic_rice.png'),
  humba: require('../../assets/images/humba.png'),
};

const CATEGORY_INGREDIENTS = {
  Rice: ['4 cups Cooked Rice', '6 cloves Minced Garlic', '2 tbsp Cooking Oil', '1 tsp Salt'],
  Meat: ['500g Choice of Meat', '1/2 cup Soy Sauce', '1/4 cup Vinegar', '4 cloves Garlic'],
  Vegetable: ['2 cups Chopped Vegetables', '1 pc Onion', '2 cloves Garlic', '1 tbsp Ginger'],
};

// Fix 2 & 3: Corrected Recipe interface — no duplicate keys, id is string
interface Recipe {
  id: string;
  name: string;
  imageKey: string; // Fix 4: unified casing to imageKey
  category: string;
  time: string;
  rating: number;
  ingredients: string[];
}

// Fix 4: imageKey used consistently throughout DATA
const DATA: Recipe[] = [
  { id: '1', name: 'Arroz Caldo',   imageKey: 'arroz_caldo',  category: 'Rice',      rating: 4.8, time: '45m',  ingredients: CATEGORY_INGREDIENTS.Rice      },
  { id: '2', name: 'Garlic Rice',   imageKey: 'garlic_rice',  category: 'Rice',      rating: 4.5, time: '15m',  ingredients: CATEGORY_INGREDIENTS.Rice      },
  { id: '3', name: 'Beef Pares',    imageKey: 'beefpares',    category: 'Meat',      rating: 4.9, time: '2h',   ingredients: CATEGORY_INGREDIENTS.Meat      },
  { id: '4', name: 'Binagoongan',   imageKey: 'binagoongan',  category: 'Vegetable', rating: 4.7, time: '50m',  ingredients: CATEGORY_INGREDIENTS.Vegetable },
  { id: '5', name: 'Beef Tapa',     imageKey: 'beef_tapa',    category: 'Meat',      rating: 4.6, time: '20m',  ingredients: CATEGORY_INGREDIENTS.Meat      },
  { id: '6', name: 'Chicken Adobo', imageKey: 'chickenadobo', category: 'Meat',      rating: 4.9, time: '1h',   ingredients: CATEGORY_INGREDIENTS.Meat      },
  { id: '7', name: 'Crispy Lechon', imageKey: 'crispy_lechon',category: 'Meat',      rating: 5.0, time: '3h',   ingredients: CATEGORY_INGREDIENTS.Meat      },
  { id: '9', name: 'Bulalo Soup',   imageKey: 'bulalo',       category: 'Vegetable', rating: 4.9, time: '2.5h', ingredients: CATEGORY_INGREDIENTS.Vegetable },
];

const FEATURED_DATA = [
  { id: 'f1', title: 'Chicken Adobo', tag: 'Chef Choice', imageKey: 'chickenadobo' },
  { id: 'f2', title: 'Crispy Lechon', tag: 'Trending',    imageKey: 'crispy_lechon' },
];

// Fix 7: RecipeItem defined as a proper component
const RecipeItem = ({
  name,
  image,
  onPress,
}: {
  name: string;
  image: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.recipeCard} onPress={onPress}>
    <Image source={RecipeImages[image]} style={styles.thumb} />
    <Text style={styles.recipeName}>{name}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // Fix 8: selectedRecipe state declared
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Fix 6: Animated value and PanResponder declared
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          setSelectedRecipe(null);
          pan.setValue({ x: 0, y: 0 });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    fetch(`${BASE_URL}/api/recipes/`)
      .then((res) => {
        if (!res.ok) throw new Error('Connection failed');
        return res.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load recipes.');
        setLoading(false);
      });
  }, []);

  const addRecipe = (newRecipeData: any) => {
    fetch(`${BASE_URL}/api/recipes/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token c90c32d906f7fb597d310f44a4e8d4c6bb67e50e',
      },
      body: JSON.stringify(newRecipeData),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert('Success', 'Recipe Added!');
        setRecipes((prev) => [...prev, data]);
      })
      .catch(() => Alert.alert('Error', 'Check your Token'));
  };

  if (loading) return <ActivityIndicator size="large" color="#000" style={{ marginTop: 100 }} />;
  if (error)   return <Text style={styles.errorText}>{error}</Text>;

  // Use API recipes if available, fall back to local DATA
  const displayRecipes = recipes.length > 0 ? recipes : DATA;

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
      >
        {/* Hero Banner */}
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: 'https://placehold.co/600x400.png' }}
            style={styles.heroImg}
          />
        </View>

        <Text style={styles.sectionTitle}>Newly Recipes added {'>'}</Text>

        {displayRecipes.length > 0 ? (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={displayRecipes}
            keyExtractor={(item) => item.id.toString()}
            // Fix 4 & 7: use imageKey, pass onPress to open modal
            renderItem={({ item }) => (
              <RecipeItem
                name={item.name}
                image={item.imageKey}
                onPress={() => {
                  pan.setValue({ x: 0, y: 0 });
                  setSelectedRecipe(item);
                }}
              />
            )}
          />
        ) : (
          <Text style={{ marginLeft: 20 }}>No recipes found.</Text>
        )}

        {/* Demo button for Task 4 */}
        <TouchableOpacity
          style={styles.testBtn}
          onPress={() =>
            addRecipe({
              name: 'Mobile Demo',
              category: 'Rice',
              image_key: 'arroz_caldo.png',
              time: '30',
              rating: 4.0,
            })
          }
        >
          <Text>Demo Add Recipe (Task 4)</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fix 6: Modal now has all required refs/state defined above */}
      <Modal transparent visible={!!selectedRecipe} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]}
          >
            {selectedRecipe && (
              <>
                <View
                  style={styles.modalImageWrapper}
                  {...panResponder.panHandlers}
                >
                  <Image
                    source={RecipeImages[selectedRecipe.imageKey]}
                    style={styles.modalHeroImage}
                  />
                  <View style={styles.dragHandle} />
                </View>

                <View style={styles.modalScrollBody}>
                  <Text style={styles.modalRecipeTitle}>{selectedRecipe.name}</Text>

                  <View style={styles.infoStrip}>
                    <Text style={styles.infoText}>⭐ {selectedRecipe.rating}</Text>
                    <Text style={styles.infoText}>🕒 {selectedRecipe.time}</Text>
                  </View>

                  <Text style={styles.subtitle}>Ingredients List</Text>

                  <ScrollView style={styles.ingScrollView} nestedScrollEnabled>
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <View key={i} style={styles.ingRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.ingText}>{ing}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => {
                      setSelectedRecipe(null);
                    }}
                  >
                    <Text style={styles.ctaText}>Start Cooking</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#FFBA74' },
  scrollPadding:     { paddingBottom: 100 },

  // Hero
  heroWrapper:       { margin: 20, height: 220, borderRadius: 20, overflow: 'hidden' },
  heroImg:           { width: '100%', height: '100%', resizeMode: 'cover' },

  // Section
  sectionTitle:      { fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginBottom: 15, fontFamily: 'serif' },

  // Recipe card
  recipeCard:        { marginLeft: 20, alignItems: 'center', width: 100 },
  thumb:             { width: 100, height: 100, borderRadius: 15 },
  recipeName:        { marginTop: 8, fontFamily: 'serif', fontSize: 13, textAlign: 'center' },

  // Demo button
  testBtn:           { backgroundColor: '#fff', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },

  // Error
  errorText:         { color: 'red', textAlign: 'center', marginTop: 100 },

  // Modal
  modalOverlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent:      { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', maxHeight: height * 0.85 },
  modalImageWrapper: { width: '100%', height: 220, position: 'relative' },
  modalHeroImage:    { width: '100%', height: '100%', resizeMode: 'cover' },
  dragHandle:        { position: 'absolute', bottom: 10, alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
  modalScrollBody:   { padding: 20 },
  modalRecipeTitle:  { fontSize: 24, fontWeight: 'bold', fontFamily: 'serif', marginBottom: 8 },
  infoStrip:         { flexDirection: 'row', gap: 16, marginBottom: 16 },
  infoText:          { fontSize: 15, color: '#555' },
  subtitle:          { fontSize: 17, fontWeight: '600', marginBottom: 10 },
  ingScrollView:     { maxHeight: 180, marginBottom: 16 },
  ingRow:            { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bullet:            { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFBA74', marginRight: 10 },
  ingText:           { fontSize: 14, color: '#333' },
  ctaButton:         { backgroundColor: '#FF6B35', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  ctaText:           { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});