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
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  Animated,
  PanResponder,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

interface RecentRecipe {
  id: string;
  name: string;
  image: ImageSourcePropType;
  viewedAt: string;
  rating: number;
  time: string;
  ingredients: string[];
}

const INITIAL_DATA: RecentRecipe[] = [
  { 
    id: '1', 
    name: 'Garlic Rice', 
    image: require('../../assets/images/garlic_rice.png'), 
    viewedAt: '2h ago',
    rating: 4.5,
    time: '15 mins',
    ingredients: ['4 cups Day-old Jasmine Rice', '10 cloves Garlic, crushed', '3 tbsp Vegetable Oil', '1 tsp Rock Salt']
  },
  { 
    id: '2', 
    name: 'Arroz Caldo', 
    image: require('../../assets/images/arroz_caldo.png'), 
    viewedAt: '5h ago',
    rating: 4.8,
    time: '45 mins',
    ingredients: ['1 kg Chicken Thighs', '2 cups Glutinous Rice', 'Ginger', 'Fried Garlic', 'Fish Sauce']
  },
  { 
    id: '3', 
    name: 'Beef Pares', 
    image: require('../../assets/images/beefpares.png'), 
    viewedAt: 'Yesterday',
    rating: 4.9,
    time: '2 hours',
    ingredients: ['Beef Brisket', 'Star Anise', 'Soy Sauce', 'Brown Sugar', 'Beef Stock']
  },
  { 
    id: '4', 
    name: 'Pork Binagoongan', 
    image: require('../../assets/images/binagoongan.png'), 
    viewedAt: '2 days ago',
    rating: 4.7,
    time: '50 mins',
    ingredients: ['Pork Belly', 'Shrimp Paste', 'Tomatoes', 'Eggplant', 'Chilies']
  },
];

export default function RecentlyViewedScreen({ title = "Recently Viewed" }) {
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecentRecipe[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecentRecipe | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // --- GESTURE LOGIC (SWIPE TO CLOSE) ---
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          closeRecipeModal();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 8 }).start();
        }
      },
    })
  ).current;

  const closeRecipeModal = () => {
    Animated.timing(pan, { toValue: { x: 0, y: height }, duration: 300, useNativeDriver: false }).start(() => {
      setSelectedRecipe(null);
      pan.setValue({ x: 0, y: 0 });
    });
  };

  const handleClearAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRecipes([]);
    setShowConfirmModal(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const renderItem = ({ item }: { item: RecentRecipe }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.card}
      onPress={() => setSelectedRecipe(item)}
    >
      <Image source={item.image} style={styles.img} />
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.timeRow}>
          <Feather name="clock" size={12} color="#888" />
          <Text style={styles.timeText}> {item.viewedAt}</Text>
        </View>
      </View>
      <View style={styles.viewBadge}>
        <Feather name="eye" size={12} color="#FF8C00" />
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <MaterialCommunityIcons name="history" size={50} color="#E0D8CF" />
      </View>
      <Text style={styles.emptyTitle}>Your history is clean</Text>
      <Text style={styles.emptySub}>Recipes you view will appear here.</Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <FlatList
        data={recipes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={() => (
          <View style={styles.headerArea}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{recipes.length} recipes recently viewed</Text>
            </View>
            {recipes.length > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={() => setShowConfirmModal(true)}>
                <Feather name="trash-2" size={14} color="#FF8C00" />
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listPadding}
      />

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Modal transparent visible={showConfirmModal} animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.confirmBox}>
            <Ionicons name="alert-circle" size={50} color="#FF8C00" />
            <Text style={styles.modalTitle}>Clear History?</Text>
            <Text style={styles.modalSub}>This will remove all recent records.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteBtn} onPress={handleClearAll}>
                <Text style={styles.confirmDeleteText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- SWIPEABLE RECIPE DETAIL MODAL --- */}
      <Modal transparent visible={!!selectedRecipe} animationType="fade">
        <View style={styles.modalOverlayBottom}>
          <Animated.View 
            style={[styles.recipeModalContent, { transform: [{ translateY: pan.y }] }]}
          >
            {selectedRecipe && (
              <>
                <View style={styles.modalImageWrapper} {...panResponder.panHandlers}>
                  <Image source={selectedRecipe.image} style={styles.modalHeroImage} />
                  <View style={styles.dragHandle} />
                </View>

                <View style={styles.modalScrollBody}>
                  <View style={styles.modalHeaderRow}>
                    <Text style={styles.modalRecipeTitle}>{selectedRecipe.name}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(selectedRecipe.id)}>
                      <Ionicons 
                        name={favorites.includes(selectedRecipe.id) ? "heart" : "heart-outline"} 
                        size={28} color={favorites.includes(selectedRecipe.id) ? "#FF4444" : "#333"} 
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statBox}><Feather name="clock" size={18} color="#FF8C00" /><Text style={styles.statText}>{selectedRecipe.time}</Text></View>
                    <View style={styles.statBox}><Feather name="star" size={18} color="#FF8C00" /><Text style={styles.statText}>{selectedRecipe.rating}</Text></View>
                    <View style={styles.statBox}><Feather name="zap" size={18} color="#FF8C00" /><Text style={styles.statText}>Easy</Text></View>
                  </View>

                  <Text style={styles.subtitleSmall}>Ingredients</Text>
                  <ScrollView showsVerticalScrollIndicator={false} style={styles.ingredientsScroll}>
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <View key={idx} style={styles.ingRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.ingText}>{ing}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <TouchableOpacity 
                    style={styles.ctaButton}
                    onPress={() => { setSelectedRecipe(null); router.push('/cook/cooking'); }}
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
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 25, paddingHorizontal: 15 } as ViewStyle,
  titleContainer: { flex: 1 } as ViewStyle,
  title: { fontSize: 26, fontWeight: '900', color: '#333' } as TextStyle,
  subtitle: { fontSize: 13, color: '#888', fontWeight: '600' } as TextStyle,
  clearBtn: { backgroundColor: '#FFF4E6', flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#FFE0B2' } as ViewStyle,
  clearText: { fontSize: 13, fontWeight: '800', color: '#FF8C00', marginLeft: 6 } as TextStyle,
  listPadding: { paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 } as ViewStyle,
  row: { justifyContent: 'space-between' } as ViewStyle,
  card: { backgroundColor: '#FFF', width: '47.5%', borderRadius: 25, marginBottom: 18, elevation: 4, overflow: 'hidden' } as ViewStyle,
  img: { width: '100%', height: 130 } as ImageStyle,
  viewBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 6, borderRadius: 10 } as ViewStyle,
  cardContent: { padding: 12 } as ViewStyle,
  name: { fontSize: 15, fontWeight: '800', color: '#333' } as TextStyle,
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 } as ViewStyle,
  timeText: { fontSize: 11, color: '#888', fontWeight: '600' } as TextStyle,
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 } as ViewStyle,
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5F0EA', justifyContent: 'center', alignItems: 'center', marginBottom: 20 } as ViewStyle,
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#333' } as TextStyle,
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', paddingHorizontal: 40 } as TextStyle,

  // --- MODAL STYLES ---
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' } as ViewStyle,
  modalOverlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' } as ViewStyle,
  confirmBox: { width: width * 0.85, backgroundColor: '#FFF', borderRadius: 30, padding: 30, alignItems: 'center' } as ViewStyle,
  recipeModalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, height: height * 0.88, overflow: 'hidden' } as ViewStyle,
  modalImageWrapper: { width: '100%', height: 320 } as ViewStyle,
  modalHeroImage: { width: '100%', height: '100%', resizeMode: 'cover' } as ImageStyle,
  dragHandle: { position: 'absolute', top: 15, alignSelf: 'center', width: 50, height: 6, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10, zIndex: 20 } as ViewStyle,
  modalScrollBody: { paddingHorizontal: 30, paddingTop: 30, flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30 } as ViewStyle,
  modalRecipeTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', flex: 1 } as TextStyle,
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } as ViewStyle,
  statsRow: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 20, padding: 15, marginBottom: 25 } as ViewStyle,
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' } as ViewStyle,
  statText: { marginLeft: 6, fontWeight: '700', color: '#444' } as TextStyle,
  subtitleSmall: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 15 } as TextStyle,
  ingredientsScroll: { flex: 1, marginBottom: 10 } as ViewStyle,
  ingRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 } as ViewStyle,
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8C00', marginRight: 12, marginTop: 8 } as ViewStyle,
  ingText: { fontSize: 16, color: '#666', fontWeight: '500', flex: 1 } as TextStyle,
  ctaButton: { backgroundColor: '#FF8C00', flexDirection: 'row', height: 70, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 25, elevation: 8 } as ViewStyle,
  ctaText: { color: '#FFF', fontSize: 18, fontWeight: '900', marginRight: 10 } as TextStyle,
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#333', marginTop: 15 } as TextStyle,
  modalSub: { fontSize: 15, color: '#666', textAlign: 'center', marginVertical: 10 } as TextStyle,
  modalActions: { flexDirection: 'row', width: '100%', marginTop: 20 } as ViewStyle,
  cancelBtn: { flex: 1, height: 55, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 18, marginRight: 10 } as ViewStyle,
  cancelBtnText: { color: '#888', fontWeight: '700' } as TextStyle,
  confirmDeleteBtn: { flex: 1, height: 55, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF8C00', borderRadius: 18 } as ViewStyle,
  confirmDeleteText: { color: '#FFF', fontWeight: '800' } as TextStyle,
});