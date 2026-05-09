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
  Modal,
  Animated,
  PanResponder,
  ScrollView,
  ActivityIndicator,
  RefreshControl // Added for pull-to-refresh
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router'; // Added useFocusEffect
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

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

export default function FavouritesScreen() {
  const router = useRouter();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) pan.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          closeModal();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 8 }).start();
        }
      },
    })
  ).current;

  // This triggers a reload EVERY time you navigate to this tab
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const savedIds = await AsyncStorage.getItem('user_favorites');
      if (!savedIds) {
        setFavoriteRecipes([]);
        setLoading(false);
        return;
      }
      const parsedIds: (string | number)[] = JSON.parse(savedIds);

      const res = await fetch(`${BASE_URL}/recipes/`);
      const allRecipes: Recipe[] = await res.json();

      const filtered = allRecipes.filter(recipe => parsedIds.includes(recipe.id));
      setFavoriteRecipes(filtered);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop the spinner
    }
  };

  // Function called when pulling down
  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const removeFavorite = async (id: string | number) => {
    try {
      const savedIds = await AsyncStorage.getItem('user_favorites');
      if (savedIds) {
        const parsedIds: (string | number)[] = JSON.parse(savedIds);
        const newIds = parsedIds.filter(favId => favId !== id);
        await AsyncStorage.setItem('user_favorites', JSON.stringify(newIds));
        setFavoriteRecipes(prev => prev.filter(r => r.id !== id));
        if (selectedRecipe?.id === id) closeModal();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => {
    Animated.timing(pan, { toValue: { x: 0, y: height }, duration: 300, useNativeDriver: false }).start(() => {
      setSelectedRecipe(null);
      pan.setValue({ x: 0, y: 0 });
    });
  };

  const getIngredientsList = (ingData: string | undefined) => {
    if (!ingData) return [];
    return ingData.split(/[,\n]+/).map(item => item.trim()).filter(item => item !== "");
  };

  const renderItem = ({ item }: { item: Recipe }) => {
    const cleanedKey = item.image_key?.replace('.png', '').replace('.jpg', '');
    const imgSource = RecipeImages[cleanedKey] || { uri: 'https://placehold.co/150x150.png' };

    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => setSelectedRecipe(item)}>
        <Image source={imgSource} style={styles.img} />
        <TouchableOpacity style={styles.heartBadge} onPress={() => removeFavorite(item.id)}>
          <AntDesign name="heart" size={14} color="#FF4B4B" />
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <View style={styles.infoRow}>
            <Feather name="clock" size={12} color="#888" />
            <Text style={styles.infoText}> {item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FF8C00" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader />
      
      <FlatList
        data={favoriteRecipes}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#FF8C00']} // Android spinner color
            tintColor={'#FF8C00'} // iOS spinner color
          />
        }
        ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
                <Feather name="heart" size={50} color="#DDD" />
                <Text style={styles.emptyText}>No saved recipes yet!</Text>
                <Text style={styles.emptySubText}>Pull down to refresh</Text>
            </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.headerArea}>
            <Text style={styles.title}>Saved Recipes</Text>
            <Text style={styles.subtitle}>Your personal cookbook</Text>
          </View>
        )}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />

      <Modal animationType="fade" transparent={true} visible={!!selectedRecipe} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]} {...panResponder.panHandlers}>
            {selectedRecipe && (
              <>
                <View style={styles.modalImageWrapper}>
                  <Image source={RecipeImages[selectedRecipe.image_key?.replace('.png', '').replace('.jpg', '')] || { uri: 'https://placehold.co/400x320.png' }} style={styles.modalHeroImage} />
                  <View style={styles.dragHandle} />
                </View>
                <View style={styles.modalScrollBody}>
                  <View style={styles.modalHeaderRow}>
                    <Text style={styles.modalRecipeTitle}>{selectedRecipe.name}</Text>
                    <TouchableOpacity onPress={() => removeFavorite(selectedRecipe.id)}>
                      <AntDesign name="heart" size={28} color="#FF4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statBox}><Feather name="clock" size={18} color="#FF8C00" /><Text style={styles.statText}>{selectedRecipe.time}</Text></View>
                    <View style={styles.statBox}><Feather name="star" size={18} color="#FF8C00" /><Text style={styles.statText}>{selectedRecipe.rating}</Text></View>
                  </View>

                  <Text style={styles.subtitleLabel}>Ingredients</Text>
                  <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    {getIngredientsList(selectedRecipe.ingredients).map((ing, idx) => (
                      <View key={idx} style={styles.ingRow}>
                        <View style={styles.bullet} /><Text style={styles.ingText}>{ing}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <TouchableOpacity style={styles.ctaButton} onPress={() => { closeModal(); router.push('/cook/cooking'); }}>
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
  headerArea: { paddingHorizontal: 5, paddingVertical: 20 } as ViewStyle,
  title: { fontSize: 26, fontWeight: '900', color: '#333' } as TextStyle,
  subtitle: { fontSize: 14, color: '#888', fontWeight: '500', marginTop: 2 } as TextStyle,
  listPadding: { paddingHorizontal: 20, paddingBottom: 100 } as ViewStyle,
  row: { justifyContent: 'space-between' } as ViewStyle,
  card: { backgroundColor: '#FFF', width: '48%', borderRadius: 25, marginBottom: 18, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, overflow: 'hidden' } as ViewStyle,
  img: { width: '100%', height: 150, resizeMode: 'cover' } as ImageStyle,
  heartBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' } as ViewStyle,
  cardContent: { padding: 12 } as ViewStyle,
  name: { fontSize: 15, fontWeight: '800', color: '#333' } as TextStyle,
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 } as ViewStyle,
  infoText: { fontSize: 12, color: '#888', fontWeight: '600' } as TextStyle,
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#999', fontSize: 16, fontWeight: '600' },
  emptySubText: { color: '#BBB', fontSize: 12, marginTop: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, height: height * 0.88, overflow: 'hidden' },
  modalImageWrapper: { width: '100%', height: 320 },
  modalHeroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  dragHandle: { position: 'absolute', top: 15, alignSelf: 'center', width: 50, height: 6, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10, zIndex: 20 },
  modalScrollBody: { padding: 30, flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalRecipeTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', flex: 1 },
  statsRow: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 20, padding: 15, marginBottom: 25 },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  statText: { marginLeft: 6, fontWeight: '700', color: '#444' },
  subtitleLabel: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 15 },
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8C00', marginRight: 12 },
  ingText: { fontSize: 16, color: '#666', fontWeight: '500' },
  ctaButton: { backgroundColor: '#FF8C00', flexDirection: 'row', height: 70, borderRadius: 25, alignItems: 'center', justifyContent: 'center', elevation: 8 },
  ctaText: { color: '#FFF', fontSize: 18, fontWeight: '900', marginRight: 10 },
});