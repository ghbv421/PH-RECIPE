import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image,
  FlatList, SafeAreaView, ActivityIndicator,
  TouchableOpacity, Modal, Animated, Dimensions, PanResponder,
  ImageBackground, ViewStyle, TextStyle, ImageStyle,
  RefreshControl // Added for pull-to-refresh
} from 'react-native';
import { SharedHeader } from '../../components/SharedHeader';
import { AntDesign } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// --- CONFIG ---
const IP_ADDRESS = '192.168.1.35'; 
const BASE_URL = `http://${IP_ADDRESS}:8000/api`;

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

interface Category {
  id: number;
  name: string;
}

interface Recipe {
  id: string | number;
  name: string;
  image_key: string; 
  category: any;
  time: string;
  rating: number;
  ingredients?: string;
}

const RecipeItem = ({ 
  item, 
  onPress, 
  isFavorite, 
  onToggleFavorite 
}: { 
  item: Recipe; 
  onPress: () => void; 
  isFavorite: boolean; 
  onToggleFavorite: () => void;
}) => {
  const cleanedKey = item.image_key ? item.image_key.replace('.png', '').replace('.jpg', '') : 'arroz_caldo';
  const imageSource = RecipeImages[cleanedKey] || { uri: 'https://placehold.co/100x100.png' };
  const categoryName = typeof item.category === 'object' ? item.category.name : item.category;

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.recipeCard} onPress={onPress}>
      <ImageBackground source={imageSource} style={styles.imageBg} imageStyle={{ borderRadius: 20 }}>
        <View style={styles.cardOverlay}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {item.rating}</Text>
            </View>
            
            <TouchableOpacity style={styles.heartCircle} onPress={onToggleFavorite}>
              <AntDesign 
                name={(isFavorite ? "heart" : "hearto") as any} 
                size={16} 
                color={isFavorite ? "#FF4444" : "#FFF"} 
              />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.cardRecipeName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cardRecipeTime}>{item.time} • {categoryName}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Reload state
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          setSelectedRecipe(null);
          pan.setValue({ x: 0, y: 0 });
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  // Reusable fetch logic for initial load and pull-to-refresh
  const fetchData = async () => {
    try {
      const savedFavs = await AsyncStorage.getItem('user_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const [catRes, recipeRes] = await Promise.all([
        fetch(`${BASE_URL}/categories/`),
        fetch(`${BASE_URL}/recipes/`)
      ]);

      if (!catRes.ok || !recipeRes.ok) throw new Error("Server communication error");

      const catData = await catRes.json();
      const recipeData = await recipeRes.json();

      setCategories([{ id: 0, name: 'All' }, ...catData]);
      setRecipes(recipeData);
      setError(null);
    } catch (err) {
      setError('Connection failed. Drag down to try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const toggleFavorite = async (id: string | number) => {
    try {
      let newFavs = favorites.includes(id) 
        ? favorites.filter(favId => favId !== id) 
        : [...favorites, id];
      setFavorites(newFavs);
      await AsyncStorage.setItem('user_favorites', JSON.stringify(newFavs));
    } catch (e) {
      console.error("Error saving favorite:", e);
    }
  };

  const addToRecentlyViewed = async (recipe: Recipe) => {
    try {
      const storedRecent = await AsyncStorage.getItem('recently_viewed');
      let recentList: (string | number)[] = storedRecent ? JSON.parse(storedRecent) : [];
      recentList = recentList.filter(id => id !== recipe.id);
      recentList.unshift(recipe.id);
      if (recentList.length > 10) recentList = recentList.slice(0, 10);
      await AsyncStorage.setItem('recently_viewed', JSON.stringify(recentList));
    } catch (e) {
      console.error("Error saving recently viewed:", e);
    }
  };

  const handleRecipePress = (recipe: Recipe) => {
    pan.setValue({ x: 0, y: 0 });
    setSelectedRecipe(recipe);
    addToRecentlyViewed(recipe);
  };

  const filteredRecipes = selectedCategory === 'All' 
    ? recipes 
    : recipes.filter(recipe => {
        const catName = typeof recipe.category === 'object' ? recipe.category.name : recipe.category;
        return catName === selectedCategory;
      });

  const getIngredientsList = (ingData: string | undefined) => {
    if (!ingData) return [];
    return ingData.split(/[,\n]+/).map(item => item.trim()).filter(item => item !== "");
  };

  if (loading && !refreshing) return <ActivityIndicator size="large" color="#FF8C00" style={{ marginTop: 100 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollPadding}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#FF8C00']} 
            tintColor={'#FF8C00'}
          />
        }
      >
        <View style={styles.headerPadding}>
          <Text style={styles.mainTitle}>Delicious Recipes</Text>
          <Text style={styles.subTitle}>Authentic Filipino Flavors</Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.name)}
              style={[
                styles.categoryPill,
                selectedCategory === cat.name && styles.categoryPillActive
              ]}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat.name && styles.categoryTextActive
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.heroWrapper}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} style={styles.heroImg} />
          <View style={styles.heroOverlay}>
             <Text style={styles.heroText}>Today's Special Selection</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'Recently Added' : `${selectedCategory} Recipes`}
        </Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          renderItem={({ item }) => (
            <RecipeItem
              item={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPress={() => handleRecipePress(item)}
            />
          )}
        />
      </ScrollView>

      <Modal transparent visible={!!selectedRecipe} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]}>
            {selectedRecipe && (
              <>
                <View style={styles.modalImageWrapper} {...panResponder.panHandlers}>
                  <Image
                    source={RecipeImages[selectedRecipe.image_key?.replace('.png', '').replace('.jpg', '')] || { uri: 'https://placehold.co/400x220.png' }}
                    style={styles.modalHeroImage}
                  />
                  <View style={styles.dragHandle} />
                  <TouchableOpacity 
                    style={styles.modalHeart} 
                    onPress={() => toggleFavorite(selectedRecipe.id)}
                  >
                    <AntDesign 
                      name={(favorites.includes(selectedRecipe.id) ? "heart" : "hearto") as any} 
                      size={24} 
                      color={favorites.includes(selectedRecipe.id) ? "#FF4444" : "#FFF"} 
                    />
                  </TouchableOpacity>
                </View>
                
                <div style={styles.modalScrollBody}>
                  <Text style={styles.modalRecipeTitle}>{selectedRecipe.name}</Text>
                  <View style={styles.infoStrip}>
                    <Text style={styles.infoText}>⭐ {selectedRecipe.rating}</Text>
                    <Text style={styles.infoText}>🕒 {selectedRecipe.time}</Text>
                  </View>
                  
                  <Text style={styles.modalSubtitle}>Ingredients List</Text>
                  <ScrollView style={styles.ingScrollView} nestedScrollEnabled>
                    {getIngredientsList(selectedRecipe.ingredients).map((ing, i) => (
                      <View key={i} style={styles.ingRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.ingText}>{ing}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <TouchableOpacity style={styles.ctaButton} onPress={() => setSelectedRecipe(null)}>
                    <Text style={styles.ctaText}>Back to Recipes</Text>
                  </TouchableOpacity>
                </div>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF7F0' } as ViewStyle,
  headerPadding: { paddingHorizontal: 20, paddingTop: 10, marginBottom: 10 } as ViewStyle,
  mainTitle: { fontSize: 26, fontWeight: '900', color: '#333' } as TextStyle,
  subTitle: { fontSize: 14, color: '#888', fontWeight: '500', marginTop: 2 } as TextStyle,
  scrollPadding: { paddingBottom: 40 },
  errorBanner: { backgroundColor: '#FFEBEB', margin: 20, padding: 10, borderRadius: 10, alignItems: 'center' },
  errorText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 12 },
  categoryContainer: { paddingLeft: 20, marginBottom: 20, height: 50, alignItems: 'center' },
  categoryPill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 10, borderWidth: 1, borderColor: '#EEE', height: 38, justifyContent: 'center' },
  categoryPillActive: { backgroundColor: '#FF8C00', borderColor: '#FF8C00' },
  categoryText: { color: '#888', fontWeight: '700', fontSize: 13 },
  categoryTextActive: { color: '#FFF' },
  heroWrapper: { marginHorizontal: 20, height: 160, borderRadius: 25, overflow: 'hidden', marginBottom: 25, elevation: 5 },
  heroImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end', padding: 15 },
  heroText: { color: 'white', fontSize: 18, fontWeight: '800' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#333', marginLeft: 20, marginBottom: 15 },
  recipeCard: { width: 160, height: 220, marginRight: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, backgroundColor: 'transparent' } as ViewStyle,
  imageBg: { width: '100%', height: '100%' } as ImageStyle,
  cardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 20, padding: 12, justifyContent: 'space-between' } as ViewStyle,
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heartCircle: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 6, borderRadius: 15 },
  cardRecipeName: { fontSize: 16, fontWeight: '800', color: 'white' } as TextStyle,
  cardRecipeTime: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '600' } as TextStyle,
  ratingBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingText: { fontSize: 10, fontWeight: 'bold', color: '#333' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FDF7F0', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden', maxHeight: height * 0.85 },
  modalImageWrapper: { width: '100%', height: 250, position: 'relative' },
  modalHeroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  dragHandle: { position: 'absolute', top: 12, alignSelf: 'center', width: 45, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  modalHeart: { position: 'absolute', right: 20, bottom: -25, backgroundColor: '#FFF', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalScrollBody: { padding: 25, paddingTop: 35 },
  modalRecipeTitle: { fontSize: 26, fontWeight: '900', color: '#333', marginBottom: 10 },
  infoStrip: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  infoText: { fontSize: 14, color: '#666', fontWeight: '600', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, elevation: 1 },
  modalSubtitle: { fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 12 },
  ingScrollView: { maxHeight: 200, marginBottom: 20 },
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8C00', marginRight: 12 },
  ingText: { fontSize: 15, color: '#444', lineHeight: 20 },
  ctaButton: { backgroundColor: '#FF8C00', borderRadius: 18, paddingVertical: 16, alignItems: 'center', elevation: 3 },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});