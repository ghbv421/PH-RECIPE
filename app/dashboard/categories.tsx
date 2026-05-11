import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ImageBackground, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// API Configuration
const IP_ADDRESS = '192.168.1.35'; 
const BASE_URL = `http://${IP_ADDRESS}:8000/api`;

/**
 * FIXED MAPPING:
 * These keys now match exactly what is shown in your Django Admin screenshot.
 */
const CategoryImages: { [key: string]: any } = {
  binagoongan: require('../../assets/images/binagoongan.png'),
  humba: require('../../assets/images/humba.png'),
  arroz_caldo: require('../../assets/images/arroz_caldo.png'),
  beefpares: require('../../assets/images/beefpares.png'), 
  // Add others as you create them in Admin
  default_category: require('../../assets/images/garlic_rice.png'),
};

interface Category { 
  id: string | number; 
  name: string;      
  image_key: string; 
  recipe_count?: number; 
}

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/categories/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError('Could not load categories.');
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }: { item: Category }) => {
    // Clean the key just in case you add .png in Admin later
    const cleanedKey = item.image_key?.replace('.png', '').replace('.jpg', '').trim();
    
    // Look up the image using the cleaned key
    const imageSource = CategoryImages[cleanedKey] || { uri: 'https://placehold.co/400x400.png' };

    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.card}>
        <ImageBackground 
          source={imageSource} 
          style={styles.imageBg} 
          imageStyle={{ borderRadius: 25 }}
        >
          <View style={styles.overlay}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.recipeCount}>
                {item.recipe_count ?? 0} Recipes
              </Text>
            </View>
            <View style={styles.iconCircle}>
              <Feather name="arrow-right" size={14} color="#FF8C00" />
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <SharedHeader />
      <ActivityIndicator size="large" color="#FF8C00" style={{ flex: 1 }} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader />
      <View style={styles.headerPadding}>
        <Text style={styles.mainTitle}>Explore Categories</Text>
        <Text style={styles.subTitle}>What are you craving today?</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    backgroundColor: 'transparent',
  } as ViewStyle,
  imageBg: { 
    width: '100%', 
    height: '100%',
  } as ImageStyle,
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderRadius: 25,
    padding: 15,
    justifyContent: 'space-between',
  } as ViewStyle,
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: 'white',
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
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle,
  errorText: {
    color: '#D32F2F',
    fontWeight: 'bold'
  } as TextStyle,
});