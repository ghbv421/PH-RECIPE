import React from 'react';
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
  ImageSourcePropType // Added for local asset typing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather } from '@expo/vector-icons';

interface RecipeItem {
  id: string;
  name: string;
  image: ImageSourcePropType; // UPDATED to handle require()
  rating: string;
  views: string;
}

export default function PopularViewedScreen({ title = "Popular Recipes" }) {
  const DATA: RecipeItem[] = [
    { 
      id: '1', 
      name: 'Garlic Rice', 
      image: require('../../assets/images/garlic_rice.png'), 
      rating: '4.9', 
      views: '1.2k' 
    },
    { 
      id: '2', 
      name: 'Arroz Caldo', 
      image: require('../../assets/images/arroz_caldo.png'), 
      rating: '4.8', 
      views: '950' 
    },
    { 
      id: '3', 
      name: 'Sisig Special', 
      image: require('../../assets/images/sisig.png'), 
      rating: '5.0', 
      views: '2.5k' 
    },
    { 
      id: '4', 
      name: 'Crispy Lechon', 
      image: require('../../assets/images/crispy_lechon.png'), 
      rating: '4.7', 
      views: '3.1k' 
    },
  ];

  const renderItem = ({ item }: { item: RecipeItem }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      {/* UPDATED: source={item.image} for local files */}
      <Image source={item.image} style={styles.img} />
      
      {/* Trending Badge */}
      <View style={styles.trendingBadge}>
        <Feather name="trending-up" size={10} color="#FFF" />
        <Text style={styles.trendingText}> HOT</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Feather name="star" size={12} color="#FF8C00" fill="#FF8C00" />
            <Text style={styles.statText}> {item.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <Feather name="eye" size={12} color="#888" />
            <Text style={styles.statText}> {item.views}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader />
      
      <FlatList
        data={DATA}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={() => (
          <View style={styles.headerArea}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Feather name="sliders" size={14} color="#FF8C00" />
              <Text style={styles.filterText}> Filter</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={renderItem}
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
  headerArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 5,
  } as ViewStyle,
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#333' 
  } as TextStyle,
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  } as ViewStyle,
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  } as TextStyle,
  listPadding: { 
    paddingHorizontal: 20, 
    paddingBottom: 100 
  } as ViewStyle,
  row: { 
    justifyContent: 'space-between' 
  } as ViewStyle,
  card: { 
    backgroundColor: '#FFF', 
    width: '48%', 
    borderRadius: 25, 
    marginBottom: 18, 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    overflow: 'hidden'
  } as ViewStyle,
  img: { 
    width: '100%', 
    height: 130, 
    resizeMode: 'cover'
  } as ImageStyle,
  trendingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF4B4B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1, // Ensure it stays on top of the image
  } as ViewStyle,
  trendingText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  } as TextStyle,
  cardContent: {
    padding: 12,
  } as ViewStyle,
  name: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#333' 
  } as TextStyle,
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between'
  } as ViewStyle,
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  statText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  } as TextStyle,
});