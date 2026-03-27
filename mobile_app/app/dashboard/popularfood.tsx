import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Dimensions,
  ImageSourcePropType,
  Modal,
  Animated,
  PanResponder,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface RecipeItem {
  id: string;
  name: string;
  image: ImageSourcePropType;
  rating: string;
  views: string;
  time: string;
  ingredients: string[];
}

// ... (DATA remains the same)
const DATA: RecipeItem[] = [
  { id: '1', name: 'Garlic Rice', image: require('../../assets/images/garlic_rice.png'), rating: '4.9', views: '1.2k', time: '15 min', ingredients: ['2 cups cooked rice', '5 cloves garlic', '2 tbsp oil'] },
  { id: '2', name: 'Arroz Caldo', image: require('../../assets/images/arroz_caldo.png'), rating: '4.8', views: '950', time: '30 min', ingredients: ['1 cup rice', 'Chicken ginger', 'Boiled egg'] },
  { id: '3', name: 'Beef Tapa', image: require('../../assets/images/beef_tapa.png'), rating: '4.7', views: '2.1k', time: '20 min', ingredients: ['Beef sirloin', 'Soy sauce', 'Calamansi'] },
  { id: '4', name: 'Crispy Lechon', image: require('../../assets/images/crispy_lechon.png'), rating: '5.0', views: '3.1k', time: '2h 30m', ingredients: ['Pork belly', 'Lemongrass', 'Garlic'] },
];

export default function PopularViewedScreen({ title = "Popular Recipes" }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // --- REFINED SWIPE LOGIC ---
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture vertical swipes downward
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Prevent swiping UP (only allow pulling down)
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          // If pulled down far enough or swiped fast, close it
          closeModal();
        } else {
          // Otherwise, snap back to top
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
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

  // Interpolate opacity based on pull distance
  const backdropOpacity = pan.y.interpolate({
    inputRange: [0, height * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderItem = ({ item }: { item: RecipeItem }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => setSelectedRecipe(item)}>
      <Image source={item.image} style={styles.img} />
      <View style={styles.trendingBadge}>
        <Feather name="trending-up" size={10} color="#FFF" />
        <Text style={styles.trendingText}> HOT</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Feather name="star" size={12} color="#FF8C00" fill="#FF8C00" /><Text style={styles.statText}> {item.rating}</Text></View>
          <View style={styles.statItem}><Feather name="eye" size={12} color="#888" /><Text style={styles.statText}> {item.views}</Text></View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <FlatList
        data={DATA.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={() => (
          <View style={styles.headerArea}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>Top trending picks for you</Text>
            </View>
          </View>
        )}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
      />

      <Modal transparent visible={!!selectedRecipe} animationType="none" onRequestClose={closeModal}>
        <Animated.View style={[styles.modalOverlay, { opacity: backdropOpacity }]}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeModal} />
        </Animated.View>

        <Animated.View 
            style={[
                styles.modalContent, 
                { transform: [{ translateY: pan.y.interpolate({
                    inputRange: [-100, 0, height],
                    outputRange: [0, 0, height], // Prevent swiping up past 0
                    extrapolate: 'clamp'
                }) }] }
            ]}
            {...panResponder.panHandlers}
        >
            {selectedRecipe && (
                <>
                <View style={styles.modalImageWrapper}>
                    <Image source={selectedRecipe.image} style={styles.modalHeroImage} />
                    <View style={styles.dragHandle} />
                </View>

                <View style={styles.modalScrollBody}>
                    <View style={styles.modalHeaderRow}>
                    <Text style={styles.modalRecipeTitle}>{selectedRecipe.name}</Text>
                    <TouchableOpacity onPress={() => setFavorites(f => f.includes(selectedRecipe.id) ? f.filter(x => x !== selectedRecipe.id) : [...f, selectedRecipe.id])}>
                        <Ionicons 
                        name={favorites.includes(selectedRecipe.id) ? "heart" : "heart-outline"} 
                        size={32} color={favorites.includes(selectedRecipe.id) ? "#FF4444" : "#333"} 
                        />
                    </TouchableOpacity>
                    </View>

                    <View style={styles.modalStatsRow}>
                        <View style={styles.statBox}><Feather name="clock" size={16} color="#FF8C00" /><Text style={styles.statBoxText}>{selectedRecipe.time}</Text></View>
                        <View style={styles.statBox}><Feather name="star" size={16} color="#FF8C00" /><Text style={styles.statBoxText}>{selectedRecipe.rating}</Text></View>
                        <View style={styles.statBox}><Feather name="zap" size={16} color="#FF8C00" /><Text style={styles.statBoxText}>Easy</Text></View>
                    </View>

                    <Text style={styles.modalSubtitle}>Ingredients</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    {selectedRecipe.ingredients.map((ing, idx) => (
                        <View key={idx} style={styles.ingRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.ingText}>{ing}</Text>
                        </View>
                    ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.ctaButton} onPress={() => { setSelectedRecipe(null); router.push('/cook/cooking'); }}>
                        <Text style={styles.ctaText}>Start Cooking Now</Text>
                        <Feather name="arrow-right" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
                </>
            )}
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF7F0' } as ViewStyle,
  headerArea: { paddingVertical: 25, paddingHorizontal: 15 } as ViewStyle,
  titleContainer: { flex: 1 } as ViewStyle,
  title: { fontSize: 26, fontWeight: '900', color: '#333' } as TextStyle,
  subtitle: { fontSize: 13, color: '#888', fontWeight: '600' } as TextStyle,
  listPadding: { paddingHorizontal: 20, paddingBottom: 100 } as ViewStyle,
  row: { justifyContent: 'space-between' } as ViewStyle,
  card: { backgroundColor: '#FFF', width: '47.5%', borderRadius: 25, marginBottom: 18, overflow: 'hidden', elevation: 4 } as ViewStyle,
  img: { width: '100%', height: 140 } as ImageStyle,
  trendingBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#FF4B4B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, zIndex: 1 } as ViewStyle,
  trendingText: { color: '#FFF', fontSize: 10, fontWeight: '900' } as TextStyle,
  cardContent: { padding: 12 } as ViewStyle,
  name: { fontSize: 15, fontWeight: '800' } as TextStyle,
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 } as ViewStyle,
  statItem: { flexDirection: 'row', alignItems: 'center' } as ViewStyle,
  statText: { fontSize: 12, color: '#888', fontWeight: '600' } as TextStyle,

  // --- MODAL STYLES ---
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' } as ViewStyle,
  modalContent: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%',
    height: height * 0.85, 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    overflow: 'hidden' 
  } as ViewStyle,
  modalImageWrapper: { height: 250, width: '100%' } as ViewStyle,
  modalHeroImage: { width: '100%', height: '100%', resizeMode: 'cover' } as ImageStyle,
  dragHandle: { width: 40, height: 5, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10, position: 'absolute', top: 15, alignSelf: 'center', zIndex: 10 } as ViewStyle,
  modalScrollBody: { flex: 1, padding: 25, backgroundColor: '#FFF', marginTop: -30, borderTopLeftRadius: 40, borderTopRightRadius: 40 } as ViewStyle,
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } as ViewStyle,
  modalRecipeTitle: { fontSize: 28, fontWeight: '900', color: '#333', flex: 1 } as TextStyle,
  modalStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 } as ViewStyle,
  statBox: { backgroundColor: '#FFF4E6', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 18, flexDirection: 'row', alignItems: 'center', flex: 0.3 } as ViewStyle,
  statBoxText: { marginLeft: 5, fontWeight: '700', color: '#333', fontSize: 12 } as TextStyle,
  modalSubtitle: { fontSize: 18, fontWeight: '800', marginBottom: 15 } as TextStyle,
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 } as ViewStyle,
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8C00', marginRight: 12 } as ViewStyle,
  ingText: { fontSize: 15, color: '#666' } as TextStyle,
  ctaButton: { backgroundColor: '#FF8C00', height: 65, borderRadius: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 } as ViewStyle,
  ctaText: { color: '#FFF', fontSize: 18, fontWeight: '800', marginRight: 10 } as TextStyle,
});