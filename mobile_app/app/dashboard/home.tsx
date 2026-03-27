import React, { useState, useRef } from 'react';
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
  ViewStyle,
  TextStyle,
  ImageStyle,
  ImageSourcePropType
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// --- TYPES ---
interface Recipe {
  id: string;
  name: string;
  image: ImageSourcePropType; 
  category: string;
  rating: number;
  time: string;
  ingredients: string[];
}

// --- MOCK DATA ---
const DATA: Recipe[] = [
  { 
    id: '1', 
    name: 'Arroz Caldo', 
    image: require('../../assets/images/arroz_caldo.png'),
    category: 'Rice',
    rating: 4.8,
    time: '30 mins',
    ingredients: ['1 cup Rice', '500g Chicken', 'Ginger', 'Garlic', 'Hard-boiled Egg']
  },
  { 
    id: '2', 
    name: 'Garlic Rice', 
    image: require('../../assets/images/garlic_rice.png'), 
    category: 'Rice',
    rating: 4.5,
    time: '15 mins',
    ingredients: ['2 cups Leftover Rice', '5 cloves Garlic', 'Butter', 'Salt']
  },
  { 
    id: '3', 
    name: 'Beef Pares', 
    image: require('../../assets/images/beefpares.png'), 
    category: 'Main',
    rating: 4.9,
    time: '1.5 hours',
    ingredients: ['Beef Brisket', 'Star Anise', 'Soy Sauce', 'Sugar', 'Ginger']
  },
  { 
    id: '4', 
    name: 'Binagoongan', 
    image: require('../../assets/images/binagoongan.png'), 
    category: 'Pork',
    rating: 4.7,
    time: '45 mins',
    ingredients: ['Pork Belly', 'Shrimp Paste', 'Tomato', 'Eggplant', 'Chili']
  },
];

export default function HomeScreen() {
  const router = useRouter();
  
  // --- STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // --- GESTURE LOGIC (SWIPE TO CLOSE) ---
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture vertical swipes that are moving downwards
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging downwards (positive dy)
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          // Close if swiped down far enough
          closeModal();
        } else {
          // Snap back to top if swipe was short
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const closeModal = () => {
    Animated.timing(pan, {
      toValue: { x: 0, y: height },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setSelectedRecipe(null);
      pan.setValue({ x: 0, y: 0 }); // Reset for next open
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // --- INTERNAL COMPONENTS ---
  const RecipeItem = ({ item }: { item: Recipe }) => {
    const isFavorite = favorites.includes(item.id);
    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={styles.recipeCard}
        onPress={() => setSelectedRecipe(item)}
      >
        <TouchableOpacity 
          style={styles.favoriteBadge} 
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={18} 
            color={isFavorite ? "#FF4444" : "#888"} 
          />
        </TouchableOpacity>
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.thumb} />
        </View>
        <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Feather name="star" size={10} color="#FF8C00" />
          <Text style={styles.ratingText}> {item.rating}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SharedHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.heroWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} 
            style={styles.heroImg} 
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTag}>Featured Recipe</Text>
            <Text style={styles.heroTitle}>Chicken Adobo Special</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Newly Added</Text>
        </View>

        <FlatList 
          horizontal 
          showsHorizontalScrollIndicator={false}
          data={DATA} 
          contentContainerStyle={{ paddingLeft: 20 }}
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => <RecipeItem item={item}/>} 
        />

        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Rice Dishes</Text>
        </View>

        <FlatList 
          horizontal 
          showsHorizontalScrollIndicator={false}
          data={DATA.filter(item => item.category === 'Rice')} 
          contentContainerStyle={{ paddingLeft: 20 }}
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => <RecipeItem item={item}/>} 
        />
      </ScrollView>

      {/* --- SWIPEABLE FUTURISTIC MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedRecipe}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent, 
              { transform: [{ translateY: pan.y }] }
            ]}
            {...panResponder.panHandlers}
          >
            {selectedRecipe && (
              <>
                <View style={styles.modalImageWrapper}>
                  <Image source={selectedRecipe.image} style={styles.modalHeroImage} />
                  <View style={styles.dragHandle} />
                  <View style={styles.imageOverlayShadow} />
                </View>

                <View style={styles.modalScrollBody}>
                  <View style={styles.modalHeaderRow}>
                    <Text style={styles.modalRecipeTitle}>{selectedRecipe.name}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(selectedRecipe.id)}>
                      <Ionicons 
                        name={favorites.includes(selectedRecipe.id) ? "heart" : "heart-outline"} 
                        size={28} 
                        color={favorites.includes(selectedRecipe.id) ? "#FF4444" : "#333"} 
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Feather name="clock" size={18} color="#FF8C00" />
                      <Text style={styles.statText}>{selectedRecipe.time}</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Feather name="star" size={18} color="#FF8C00" />
                      <Text style={styles.statText}>{selectedRecipe.rating}</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Feather name="zap" size={18} color="#FF8C00" />
                      <Text style={styles.statText}>Easy</Text>
                    </View>
                  </View>

                  <Text style={styles.subtitle}>Ingredients</Text>
                  <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <View key={idx} style={styles.ingRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.ingText}>{ing}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <TouchableOpacity 
                    style={styles.ctaButton}
                    onPress={() => {
                      setSelectedRecipe(null);
                      router.push('/cook/cooking');
                    }}
                  >
                    <Text style={styles.ctaText}>Start Cooking Now</Text>
                    <Feather name="arrow-right" size={20} color="#FFF" />
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
  container: { flex: 1, backgroundColor: '#FDF7F0' } as ViewStyle,
  scrollPadding: { paddingBottom: 100 } as ViewStyle,
  heroWrapper: { margin: 20, height: 200, borderRadius: 30, overflow: 'hidden', elevation: 10 },
  heroImg: { width: '100%', height: '100%' } as ImageStyle,
  heroOverlay: { position: 'absolute', bottom: 20, left: 20 } as ViewStyle,
  heroTag: { color: '#FF8C00', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' } as TextStyle,
  heroTitle: { color: '#FFF', fontSize: 26, fontWeight: '900' } as TextStyle,
  sectionHeader: { paddingHorizontal: 20, marginVertical: 15 } as ViewStyle,
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' } as TextStyle,
  recipeCard: { marginRight: 15, width: 160, backgroundColor: '#FFF', borderRadius: 25, padding: 10, elevation: 4 },
  favoriteBadge: { position: 'absolute', top: 15, right: 15, zIndex: 2, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: 6 },
  imageWrapper: { borderRadius: 20, overflow: 'hidden', marginBottom: 10 } as ViewStyle,
  thumb: { width: '100%', height: 130, resizeMode: 'cover' } as ImageStyle,
  recipeName: { fontSize: 16, fontWeight: '800', color: '#333' } as TextStyle,
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 } as ViewStyle,
  ratingText: { fontSize: 12, color: '#888', fontWeight: '600' } as TextStyle,

  // --- MODAL STYLES ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' } as ViewStyle,
  modalContent: { 
    backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, height: height * 0.88, overflow: 'hidden' 
  } as ViewStyle,
  modalImageWrapper: { width: '100%', height: 320 } as ViewStyle,
  modalHeroImage: { width: '100%', height: '100%', resizeMode: 'cover' } as ImageStyle,
  dragHandle: { 
    position: 'absolute', top: 15, alignSelf: 'center', width: 50, height: 6, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10, zIndex: 20 
  } as ViewStyle,
  imageOverlayShadow: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' } as ViewStyle,
  modalScrollBody: { padding: 30, flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30 } as ViewStyle,
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } as ViewStyle,
  modalRecipeTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', flex: 1 } as TextStyle,
  statsRow: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 20, padding: 15, marginBottom: 25 } as ViewStyle,
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' } as ViewStyle,
  statText: { marginLeft: 6, fontWeight: '700', color: '#444' } as TextStyle,
  subtitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 15 } as TextStyle,
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 } as ViewStyle,
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8C00', marginRight: 12 } as ViewStyle,
  ingText: { fontSize: 16, color: '#666', fontWeight: '500' } as TextStyle,
  ctaButton: { 
    backgroundColor: '#FF8C00', flexDirection: 'row', height: 70, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 20, elevation: 8 
  } as ViewStyle,
  ctaText: { color: '#FFF', fontSize: 18, fontWeight: '900', marginRight: 10 } as TextStyle,
});