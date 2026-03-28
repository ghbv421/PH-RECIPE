import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  StatusBar,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

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
  Vegetable: ['2 cups Chopped Vegetables', '1 pc Onion', '2 cloves Garlic', '1 tbsp Ginger']
};

interface Recipe {
  id: string;
  name: string;
  imageKey: string; 
  category: 'Rice' | 'Meat' | 'Vegetable';
  rating: number;
  time: string;
  ingredients: string[];
}

const DATA: Recipe[] = [
  { id: '1', name: 'Arroz Caldo', imageKey: 'arroz_caldo', category: 'Rice', rating: 4.8, time: '45m', ingredients: CATEGORY_INGREDIENTS.Rice },
  { id: '2', name: 'Garlic Rice', imageKey: 'garlic_rice', category: 'Rice', rating: 4.5, time: '15m', ingredients: CATEGORY_INGREDIENTS.Rice },
  { id: '3', name: 'Beef Pares', imageKey: 'beefpares', category: 'Meat', rating: 4.9, time: '2h', ingredients: CATEGORY_INGREDIENTS.Meat },
  { id: '5', name: 'Beef Tapa', imageKey: 'beef_tapa', category: 'Meat', rating: 4.6, time: '20m', ingredients: CATEGORY_INGREDIENTS.Meat },
  { id: '6', name: 'Chicken Adobo', imageKey: 'chickenadobo', category: 'Meat', rating: 4.9, time: '1h', ingredients: CATEGORY_INGREDIENTS.Meat },
  { id: '9', name: 'Bulalo Soup', imageKey: 'bulalo', category: 'Vegetable', rating: 4.9, time: '2.5h', ingredients: CATEGORY_INGREDIENTS.Vegetable },
  { id: '4', name: 'Binagoongan', imageKey: 'binagoongan', category: 'Vegetable', rating: 4.7, time: '50m', ingredients: CATEGORY_INGREDIENTS.Vegetable },
];

const FEATURED_DATA = [
  { id: 'f1', title: 'Chicken Adobo', tag: 'Chef Choice', imageKey: 'chickenadobo' },
  { id: 'f2', title: 'Crispy Lechon', tag: 'Trending', imageKey: 'crispy_lechon' },
];

export default function HomeScreen() {
  const router = useRouter();
  
  // --- TASK 1: State Management (Mod 7) ---
  const [searchQuery, setSearchQuery] = useState(''); // Text Search State
  const [activeCategory, setActiveCategory] = useState('All'); // Category Filter State
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null); // Details Modal State
  
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const pan = useRef(new Animated.ValueXY()).current;

  // --- TASK 2: State-Driven Filtering Logic ---
  const filteredData = DATA.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory; // Combined filter
  });

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = activeSlide + 1;
      if (nextIndex >= FEATURED_DATA.length) nextIndex = 0;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveSlide(nextIndex);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 10,
      onPanResponderMove: (_, gs) => { if (gs.dy > 0) pan.setValue({ x: 0, y: gs.dy }); },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 150) closeModal();
        else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  const closeModal = () => {
    Animated.timing(pan, { toValue: { x: 0, y: height }, duration: 300, useNativeDriver: false }).start(() => {
      setSelectedRecipe(null);
      pan.setValue({ x: 0, y: 0 });
    });
  };

  const renderHorizontalList = (category: 'Rice' | 'Meat' | 'Vegetable') => {
    const categoryData = filteredData.filter(r => r.category === category);
    if (categoryData.length === 0) return null;

    return (
      <View key={category} style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{category} Dishes</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoryData}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.recipeCard} onPress={() => setSelectedRecipe(item)}>
              <View style={styles.imageWrapper}>
                <Image source={RecipeImages[item.imageKey]} style={styles.thumb} resizeMode="cover" />
              </View>
              <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.ratingRow}>
                <Feather name="star" size={10} color="#FF8C00" />
                <Text style={styles.ratingText}> {item.rating} • {item.time}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* TASK 3: Navigation & Interaction (Shared Props) */}
      <SharedHeader 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Hide Featured Carousel during search/filter for better focus */}
        {!searchQuery && activeCategory === 'All' && (
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={FEATURED_DATA}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.heroWrapper}>
                  <Image source={RecipeImages[item.imageKey]} style={styles.heroImg} resizeMode="cover" />
                  <View style={styles.heroOverlay}>
                    <Text style={styles.heroTag}>{item.tag}</Text>
                    <Text style={styles.heroTitle}>{item.title}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {renderHorizontalList('Rice')}
        {renderHorizontalList('Meat')}
        {renderHorizontalList('Vegetable')}

        {/* TASK 4: State-Driven Empty State UI */}
        {filteredData.length === 0 && (
          <View style={styles.emptyContainer}>
            <Feather name="search" size={50} color="#DDD" />
            <Text style={styles.emptyText}>No matches found.</Text>
          </View>
        )}
      </ScrollView>

      {/* DETAILED VIEW MODAL */}
      <Modal transparent visible={!!selectedRecipe} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]}>
            {selectedRecipe && (
              <>
                <View style={styles.modalImageWrapper} {...panResponder.panHandlers}>
                  <Image source={RecipeImages[selectedRecipe.imageKey]} style={styles.modalHeroImage} />
                  <View style={styles.dragHandle} />
                </View>
                <View style={styles.modalScrollBody}>
                  <Text style={styles.modalRecipeTitle}>{selectedRecipe.name}</Text>
                  <View style={styles.infoStrip}>
                    <Text style={styles.infoText}>⭐ {selectedRecipe.rating}</Text>
                    <Text style={styles.infoText}>🕒 {selectedRecipe.time}</Text>
                  </View>
                  <Text style={styles.subtitle}>Ingredients List</Text>
                  <ScrollView style={styles.ingScrollView} nestedScrollEnabled={true}>
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <View key={i} style={styles.ingRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.ingText}>{ing}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <TouchableOpacity 
                    style={styles.ctaButton} 
                    onPress={() => { setSelectedRecipe(null); router.push('/cook/cooking'); }}
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
  container: { flex: 1, backgroundColor: '#FDF7F0' },
  scrollPadding: { paddingBottom: 100 },
  carouselContainer: { height: 240, marginTop: 10 },
  heroWrapper: { width: width - 40, marginHorizontal: 20, height: 220, borderRadius: 30, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', bottom: 20, left: 20 },
  heroTag: { color: '#FF8C00', fontWeight: '800', fontSize: 12 },
  heroTitle: { color: '#FFF', fontSize: 26, fontWeight: '900' },
  sectionContainer: { marginBottom: 10 },
  sectionHeader: { paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  recipeCard: { marginRight: 15, width: 160, backgroundColor: '#FFF', borderRadius: 25, padding: 10, elevation: 4 },
  imageWrapper: { borderRadius: 20, overflow: 'hidden', marginBottom: 10 },
  thumb: { width: '100%', height: 110 },
  recipeName: { fontSize: 14, fontWeight: '800', color: '#333' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingText: { fontSize: 11, color: '#888' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#999', fontSize: 16, marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, height: height * 0.85 },
  modalImageWrapper: { width: '100%', height: 280 },
  modalHeroImage: { width: '100%', height: '100%' },
  dragHandle: { position: 'absolute', top: 15, alignSelf: 'center', width: 50, height: 6, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 10 },
  modalScrollBody: { padding: 25, flex: 1 },
  modalRecipeTitle: { fontSize: 28, fontWeight: '900' },
  infoStrip: { flexDirection: 'row', marginTop: 10, gap: 15 },
  infoText: { color: '#888', fontWeight: '600' },
  subtitle: { fontSize: 18, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  ingScrollView: { flex: 1, marginBottom: 15 },
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8C00', marginRight: 10 },
  ingText: { fontSize: 15, color: '#555' },
  ctaButton: { backgroundColor: '#FF8C00', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  ctaText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
});