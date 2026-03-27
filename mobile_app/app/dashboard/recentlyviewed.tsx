import React, { useState } from 'react';
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
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

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
}

const INITIAL_DATA: RecentRecipe[] = [
  { 
    id: '1', 
    name: 'Garlic Rice', 
    image: require('../../assets/images/garlic_rice.png'), 
    viewedAt: '2h ago' 
  },
  { 
    id: '2', 
    name: 'Arroz Caldo', 
    image: require('../../assets/images/arroz_caldo.png'), 
    viewedAt: '5h ago' 
  },
  { 
    id: '3', 
    name: 'Sisig Special', 
    image: require('../../assets/images/sisig.png'), 
    viewedAt: 'Yesterday' 
  },
  { 
    id: '4', 
    name: 'Crispy Lechon', 
    image: require('../../assets/images/crispy_lechon.png'), 
    viewedAt: '2 days ago' 
  },
];

export default function RecentlyViewedScreen({ title = "Recently Viewed" }) {
  const [recipes, setRecipes] = useState<RecentRecipe[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- CLEAR ALL LOGIC ---
  const handleClearAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRecipes([]);
    setShowConfirmModal(false);
  };

  const renderItem = ({ item }: { item: RecentRecipe }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
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
        data={recipes}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={() => (
          <View style={styles.headerArea}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{recipes.length} recipes recently cooked</Text>
            </View>
            
            {recipes.length > 0 && (
              <TouchableOpacity 
                style={styles.clearBtn} 
                activeOpacity={0.7} 
                onPress={() => setShowConfirmModal(true)}
              >
                <Feather name="trash-2" size={14} color="#FF8C00" />
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      {/* --- CONFIRMATION MODAL --- */}
      <Modal
        transparent={true}
        visible={showConfirmModal}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.warningCircle}>
              <Ionicons name="alert-circle" size={40} color="#FF8C00" />
            </View>
            
            <Text style={styles.modalTitle}>Clear History?</Text>
            <Text style={styles.modalSub}>This will permanently remove all your recently viewed recipes.</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmDeleteBtn} 
                onPress={handleClearAll}
              >
                <Text style={styles.confirmDeleteText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FDF7F0' 
  } as ViewStyle,
  headerArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 15,
    marginTop: 5,
  } as ViewStyle,
  titleContainer: {
    flex: 1,
  } as ViewStyle,
  title: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: '#333',
    letterSpacing: -0.5,
  } as TextStyle,
  subtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
  } as TextStyle,
  clearBtn: {
    backgroundColor: '#FFF4E6',
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    marginRight: 5,
  } as ViewStyle,
  clearText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF8C00',
    marginLeft: 6,
  } as TextStyle,
  listPadding: { 
    paddingHorizontal: 20, 
    paddingBottom: 100,
    flexGrow: 1,
  } as ViewStyle,
  row: { 
    justifyContent: 'space-between' 
  } as ViewStyle,
  card: { 
    backgroundColor: '#FFF', 
    width: '47.5%', 
    borderRadius: 25, 
    marginBottom: 18, 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    overflow: 'hidden',
  } as ViewStyle,
  img: { 
    width: '100%', 
    height: 130, 
    resizeMode: 'cover'
  } as ImageStyle,
  viewBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 6,
    borderRadius: 10,
  } as ViewStyle,
  cardContent: {
    padding: 12,
  } as ViewStyle,
  name: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#333' 
  } as TextStyle,
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  } as ViewStyle,
  timeText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  } as TextStyle,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  } as ViewStyle,
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F0EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333',
  } as TextStyle,
  emptySub: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  } as TextStyle,

  // --- MODAL STYLES (Fixed without BlurView) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
  } as ViewStyle,
  warningCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#333',
    marginBottom: 10,
  } as TextStyle,
  modalSub: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  } as TextStyle,
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  } as ViewStyle,
  cancelBtn: {
    flex: 1,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
  } as ViewStyle,
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#888',
  } as TextStyle,
  confirmDeleteBtn: {
    flex: 1,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 18,
    backgroundColor: '#FF8C00',
  } as ViewStyle,
  confirmDeleteText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  } as TextStyle,
});