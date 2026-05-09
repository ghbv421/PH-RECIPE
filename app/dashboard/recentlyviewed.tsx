import React, { useState, useRef, useCallback } from 'react';
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
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  Animated,
  PanResponder,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

interface Recipe {
  id: string | number;
  name: string;
  image_key: string; 
  category: any;
  time: string;
  rating: number;
  ingredients?: string;
}

export default function RecentlyViewedScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);

  // --- DATA LOADING ---
  const loadRecentRecipes = async () => {
    try {
      const savedFavs = await AsyncStorage.getItem('user_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const storedRecent = await AsyncStorage.getItem('recently_viewed');
      if (!storedRecent) {
        setRecipes([]);
        setLoading(false);
        return;
      }
      const recentIds: (string | number)[] = JSON.parse(storedRecent);

      const res = await fetch(`${BASE_URL}/recipes/`);
      const allRecipes: Recipe[] = await res.json();

      const filtered = recentIds
        .map(id => allRecipes.find(r => r.id === id))
        .filter((r): r is Recipe => !!r);

      setRecipes(filtered);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecentRecipes();
    }, [])
  );

  const handleClearAll = async () => {
    try {
      await AsyncStorage.removeItem('recently_viewed');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setRecipes([]);
      setShowConfirmModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async (id: string | number) => {
    try {
      let newFavs = favorites.includes(id) 
        ? favorites.filter(favId => favId !== id) 
        : [...favorites, id];
      setFavorites(newFavs);
      await AsyncStorage.setItem('user_favorites', JSON.stringify(newFavs));
    } catch (e) {
      console.error(e);
    }
  };

  const getIngredientsList = (ingData: string | undefined) => {
    if (!ingData) return [];
    return ingData.split(/[,\n]+/).map(item => item.trim()).filter(item => item !== "");
  };

  // --- GESTURE LOGIC ---
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) pan.setValue({ x: 0, y: gestureState.dy });
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

  const renderItem = ({ item }: { item: Recipe }) => {
    const cleanedKey = item.image_key?.replace('.png', '').replace('.jpg', '');
    const imgSource = RecipeImages[cleanedKey] || { uri: 'https://placehold.co/150x150.png' };

    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={styles.card}
        onPress={() => setSelectedRecipe(item)}
      >
        <Image source={imgSource} style={styles.img} />
        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <View style={styles.timeRow}>
            <Feather name="clock" size={12} color="#888" />
            <Text style={styles.timeText}> {item.time}</Text>
          </View>
        </View>
        <View style={styles.viewBadge}>
          <Feather name="eye" size={12} color="#FF8C00" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#FF8C00" style={{ marginTop: 100 }} />;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader />
      
      <FlatList
        data={recipes}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={() => (
          <View style={styles.headerArea}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Recently Viewed</Text>
              <Text style={styles.subtitle}>{recipes.length} items in history</Text>
            </View>
            {recipes.length > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={() => setShowConfirmModal(true)}>
                <Feather name="trash-2" size={14} color="#FF8C00" />
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="history" size={60} color="#E0D8CF" />
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptySub}>Recipes you view on the Home screen will appear here.</Text>
          </View>
        )}
        contentContainerStyle={styles.listPadding}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <Modal transparent visible={showConfirmModal} animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.confirmBox}>
            {/* PATCHED: Added "as any" to prevent type error */}
            <AntDesign name={"exclamationcircle" as any} size={50} color="#FF8C00" />
            <Text style={styles.modalTitle}>Clear History?</Text>
            <Text style={styles.modalSub}>This will remove all recently viewed records.</Text>
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

      {/* RECIPE DETAIL MODAL */}
      <Modal transparent visible={!!selectedRecipe} animationType="fade">
        <View style={styles.modalOverlayBottom}>
          <Animated.View style={[styles.recipeModalContent, { transform: [{ translateY: pan.y }] }]}>
            {selectedRecipe && (
              <>
                <View style={styles.modalImageWrapper} {...panResponder.panHandlers}>
                  <Image 
                    source={RecipeImages[selectedRecipe.image_key?.replace('.png', '').replace('.jpg', '')] || { uri: 'https://placehold.co/400x320.png' }} 
                    style={styles.modalHeroImage} 
                  />
                  <View style={styles.dragHandle} />
                </View>

                <View style={styles.modalScrollBody}>
                  <View style={styles.modalHeaderRow}>
                    <Text style={styles.modalRecipeTitle}>{selectedRecipe.name}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(selectedRecipe.id)}>
                      {/* PATCHED: Added "as any" to fix heart/hearto type error */}
                      <AntDesign 
                        name={(favorites.includes(selectedRecipe.id) ? "heart" : "hearto") as any} 
                        size={28} color={favorites.includes(selectedRecipe.id) ? "#FF4444" : "#333"} 
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statBox}><Feather name="clock" size={18} color="#FF8C00" /><Text style={styles.statText}>{selectedRecipe.time}</Text></View>
                    <View style={styles.statBox}><Feather name="star" size={18} color="#FF8C00" /><Text style={styles.statText}>{selectedRecipe.rating}</Text></View>
                  </View>

                  <Text style={styles.subtitleSmall}>Ingredients</Text>
                  <ScrollView showsVerticalScrollIndicator={false} style={styles.ingredientsScroll}>
                    {getIngredientsList(selectedRecipe.ingredients).map((ing, idx) => (
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
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 25, paddingHorizontal: 5 } as ViewStyle,
  titleContainer: { flex: 1 } as ViewStyle,
  title: { fontSize: 26, fontWeight: '900', color: '#333' } as TextStyle,
  subtitle: { fontSize: 13, color: '#888', fontWeight: '600' } as TextStyle,
  clearBtn: { backgroundColor: '#FFF4E6', flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#FFE0B2' } as ViewStyle,
  clearText: { fontSize: 13, fontWeight: '800', color: '#FF8C00', marginLeft: 6 } as TextStyle,
  listPadding: { paddingHorizontal: 20, paddingBottom: 100 } as ViewStyle,
  row: { justifyContent: 'space-between' } as ViewStyle,
  card: { backgroundColor: '#FFF', width: '47.5%', borderRadius: 25, marginBottom: 18, elevation: 4, overflow: 'hidden' } as ViewStyle,
  img: { width: '100%', height: 130 } as ImageStyle,
  viewBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 6, borderRadius: 10 } as ViewStyle,
  cardContent: { padding: 12 } as ViewStyle,
  name: { fontSize: 15, fontWeight: '800', color: '#333' } as TextStyle,
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 } as ViewStyle,
  timeText: { fontSize: 11, color: '#888', fontWeight: '600' } as TextStyle,
  emptyContainer: { alignItems: 'center', marginTop: 100 } as ViewStyle,
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#333', marginTop: 20 } as TextStyle,
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', paddingHorizontal: 40, marginTop: 10 } as TextStyle,
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