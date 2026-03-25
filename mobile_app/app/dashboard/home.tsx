import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Recipe {
  id: string;
  name: string;
  image: string;
  category: string;
}

const DATA: Recipe[] = [
  { id: '1', name: 'Arroz Caldo', image: 'https://placehold.co/300x300.png', category: 'Rice' },
  { id: '2', name: 'Garlic Rice', image: 'https://placehold.co/300x300.png', category: 'Rice' },
  { id: '3', name: 'Beef Pares', image: 'https://placehold.co/300x300.png', category: 'Main' },
  { id: '4', name: 'Binagoongan', image: 'https://placehold.co/300x300.png', category: 'Pork' },
];

const RecipeItem = ({ name, image }: { name: string, image: string }) => (
  <TouchableOpacity activeOpacity={0.9} style={styles.recipeCard}>
    <View style={styles.imageWrapper}>
      <Image source={{ uri: image }} style={styles.thumb} />
    </View>
    <Text style={styles.recipeName} numberOfLines={1}>{name}</Text>
    <View style={styles.ratingRow}>
      <Feather name="star" size={10} color="#FF8C00" />
      <Text style={styles.ratingText}> 4.8</Text>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* Featured Hero Card */}
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

        {/* Newly Added Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Newly Added</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All <Feather name="chevron-right" size={14} /></Text>
          </TouchableOpacity>
        </View>

        <FlatList 
          horizontal 
          showsHorizontalScrollIndicator={false}
          data={DATA} 
          contentContainerStyle={{ paddingLeft: 20 }}
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => <RecipeItem name={item.name} image={item.image}/>} 
        />

        {/* Rice Dishes Section */}
        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Rice Dishes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All <Feather name="chevron-right" size={14} /></Text>
          </TouchableOpacity>
        </View>

        <FlatList 
          horizontal 
          showsHorizontalScrollIndicator={false}
          data={DATA.filter(item => item.category === 'Rice')} 
          contentContainerStyle={{ paddingLeft: 20 }}
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => <RecipeItem name={item.name} image={item.image}/>} 
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FDF7F0' 
  } as ViewStyle,
  scrollPadding: { 
    paddingBottom: 60 
  } as ViewStyle,
  heroWrapper: { 
    margin: 20, 
    height: 200, 
    borderRadius: 25, 
    overflow: 'hidden',
    backgroundColor: '#333',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  } as ViewStyle,
  heroImg: { 
    width: '100%', 
    height: '100%', 
    opacity: 0.85 
  } as ImageStyle,
  heroOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  } as ViewStyle,
  heroTag: {
    color: '#FF8C00',
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 4,
  } as TextStyle,
  heroTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
  } as TextStyle,
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  } as ViewStyle,
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#333',
  } as TextStyle,
  seeAll: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '600',
  } as TextStyle,
  recipeCard: { 
    marginRight: 15, 
    width: 150,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 10,
  } as ViewStyle,
  imageWrapper: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
  } as ViewStyle,
  thumb: { 
    width: '100%', 
    height: 120, 
    resizeMode: 'cover' 
  } as ImageStyle,
  recipeName: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#333',
    paddingHorizontal: 2,
  } as TextStyle,
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 2,
  } as ViewStyle,
  ratingText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  } as TextStyle,
});