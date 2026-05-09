import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ImageBackground, 
  TouchableOpacity, 
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ImageSourcePropType // Added for local asset typing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// UPDATED: image type to accept both required assets and URI strings
interface Category { 
  id: string; 
  title: string; 
  image: ImageSourcePropType; 
  count: string; 
}

const CATEGORIES: Category[] = [
  { 
    id: '1', 
    title: 'Rice Dishes', 
    image: require('../../assets/images/garlic_rice.png'), // UPDATED to local asset
    count: '12 Recipes' 
  },
  { 
    id: '2', 
    title: 'Meat & Poultry', 
    image: { uri: 'https://images.unsplash.com/photo-1544025162-d76694265947' }, 
    count: '25 Recipes' 
  },
  { 
    id: '3', 
    title: 'Fresh Seafood', 
    image: { uri: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2' }, 
    count: '18 Recipes' 
  },
  { 
    id: '4', 
    title: 'Vegetables', 
    image: { uri: 'https://images.unsplash.com/photo-1540420773420-3366772f4999' }, 
    count: '15 Recipes' 
  },
  { 
    id: '5', 
    title: 'Sweet Desserts', 
    image: { uri: 'https://images.unsplash.com/photo-1551024601-bec78aea704b' }, 
    count: '10 Recipes' 
  },
  { 
    id: '6', 
    title: 'Cold Drinks', 
    image: { uri: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd' }, 
    count: '8 Recipes' 
  },
];

export default function CategoriesScreen() {
  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <ImageBackground 
        source={item.image} // UPDATED: source passed directly
        style={styles.imageBg} 
        imageStyle={{ borderRadius: 25 }}
      >
        {/* Dark overlay to make text pop */}
        <View style={styles.overlay}>
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.recipeCount}>{item.count}</Text>
          </View>
          <View style={styles.iconCircle}>
            <Feather name="arrow-right" size={14} color="#FF8C00" />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader />
      <View style={styles.headerPadding}>
        <Text style={styles.mainTitle}>Explore Categories</Text>
        <Text style={styles.subTitle}>What are you craving today?</Text>
      </View>

      <FlatList
        data={CATEGORIES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FDF7F0' 
  } as ViewStyle,
  headerPadding: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  } as ViewStyle,
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#333',
  } as TextStyle,
  subTitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    marginTop: 2,
  } as TextStyle,
  listPadding: { 
    paddingHorizontal: 15, 
    paddingBottom: 40, 
    paddingTop: 10 
  } as ViewStyle,
  row: { 
    justifyContent: 'space-between' 
  } as ViewStyle,
  card: { 
    width: '48%', 
    height: 200, 
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Fix for Android shadow + borderRadius
    backgroundColor: 'transparent',
  } as ViewStyle,
  imageBg: { 
    width: '100%', 
    height: '100%',
  } as ImageStyle,
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Slightly darker to ensure white text is readable over Garlic Rice
    borderRadius: 25,
    padding: 15,
    justifyContent: 'space-between',
  } as ViewStyle,
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  } as TextStyle,
  recipeCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: 2,
  } as TextStyle,
  iconCircle: {
    width: 28,
    height: 28,
    backgroundColor: 'white',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  } as ViewStyle,
});