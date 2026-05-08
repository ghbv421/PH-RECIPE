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
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// --- TYPES ---
interface Fav { 
  id: string; 
  name: string; 
  image: ImageSourcePropType; 
  time: string; 
  rating: number;
  ingredients: string[];
}

const FAVS: Fav[] = [
  { 
    id: '1', 
    name: 'Garlic Rice', 
    image: require('../../assets/images/garlic_rice.png'), 
    time: '15 min',
    rating: 4.5,
    ingredients: ['2 cups Leftover Rice', '5 cloves Garlic', 'Butter', 'Salt']
  },
  { 
    id: '2', 
    name: 'Arroz Caldo', 
    image: require('../../assets/images/arroz_caldo.png'), 
    time: '30 min',
    rating: 4.8,
    ingredients: ['1 cup Rice', '500g Chicken', 'Ginger', 'Garlic', 'Hard-boiled Egg']
  },
  { 
    id: '3', 
    name: 'Beef Pares', 
    image: require('../../assets/images/beefpares.png'), 
    time: '45 min',
    rating: 4.9,
    ingredients: ['Beef Brisket', 'Star Anise', 'Soy Sauce', 'Sugar', 'Ginger']
  },
  { 
    id: '4', 
    name: 'Binagoongan', 
    image: require('../../assets/images/binagoongan.png'), 
    time: '40 min',
    rating: 4.7,
    ingredients: ['Pork Belly', 'Shrimp Paste', 'Tomato', 'Eggplant', 'Chili']
  },
];

export default function FavouritesScreen() {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<Fav | null>(null);
  
  // Modal Animation Logic
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

  const closeModal = () => {
    Animated.timing(pan, { toValue: { x: 0, y: height }, duration: 300, useNativeDriver: false }).start(() => {
      setSelectedRecipe(null);
      pan.setValue({ x: 0, y: 0 });
    });
  };

  const renderItem = ({ item }: { item: Fav }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.card} 
      onPress={() => setSelectedRecipe(item)}
    >
      <Image source={item.image} style={styles.img} />
      <View style={styles.heartBadge}>
        <Feather name="heart" size={14} color="#FF4B4B" fill="#FF4B4B" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Feather name="clock" size={12} color="#888" />
          <Text style={styles.infoText}> {item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader />
      
      <FlatList
        data={FAVS}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={() => (
          <View style={styles.headerArea}>
            <Text style={styles.title}>Saved Recipes</Text>
            <Text style={styles.subtitle}>Your personal cookbook</Text>
          </View>
        )}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      {/* --- MODAL (Identical to Home.tsx for Consistency) --- */}
      <Modal animationType="fade" transparent={true} visible={!!selectedRecipe} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]} 
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
                    <TouchableOpacity>
                      <Ionicons name="heart" size={28} color="#FF4444" />
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
                  </View>

                  <Text style={styles.subtitleLabel}>Ingredients</Text>
                  <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <View key={idx} style={styles.ingRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.ingText}>{ing}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <TouchableOpacity 
                    style={styles.ctaButton} 
                    onPress={() => { closeModal(); router.push('/cook/cooking'); }}
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
  headerArea: { paddingHorizontal: 5, paddingVertical: 20 } as ViewStyle,
  title: { fontSize: 26, fontWeight: '900', color: '#333' } as TextStyle,
  subtitle: { fontSize: 14, color: '#888', fontWeight: '500', marginTop: 2 } as TextStyle,
  listPadding: { paddingHorizontal: 20, paddingBottom: 100 } as ViewStyle,
  row: { justifyContent: 'space-between' } as ViewStyle,
  card: { 
    backgroundColor: '#FFF', width: '48%', borderRadius: 25, marginBottom: 18, 
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, overflow: 'hidden'
  } as ViewStyle,
  img: { width: '100%', height: 150, resizeMode: 'cover' } as ImageStyle,
  heartBadge: {
    position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)',
    width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,
  cardContent: { padding: 12 } as ViewStyle,
  name: { fontSize: 15, fontWeight: '800', color: '#333' } as TextStyle,
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 } as ViewStyle,
  infoText: { fontSize: 12, color: '#888', fontWeight: '600' } as TextStyle,

  // --- MODAL STYLES ---
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
  ctaButton: { 
    backgroundColor: '#FF8C00', flexDirection: 'row', height: 70, borderRadius: 25, 
    alignItems: 'center', justifyContent: 'center', elevation: 8 
  },
  ctaText: { color: '#FFF', fontSize: 18, fontWeight: '900', marginRight: 10 },
});