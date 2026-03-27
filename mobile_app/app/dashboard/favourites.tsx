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
  Dimensions,
  ImageSourcePropType
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// UPDATED: image type to accept required assets
interface Fav { 
  id: string; 
  name: string; 
  image: ImageSourcePropType; 
  time: string; 
}

const FAVS: Fav[] = [
  { 
    id: '1', 
    name: 'Garlic Rice', 
    image: require('../../assets/images/garlic_rice.png'), 
    time: '15 min' 
  },
  { 
    id: '2', 
    name: 'Arroz Caldo', 
    image: require('../../assets/images/arroz_caldo.png'), 
    time: '30 min' 
  },
  { 
    id: '3', 
    name: 'Beef Pares', 
    image: require('../../assets/images/beefpares.png'), 
    time: '45 min' 
  },
  { 
    id: '4', 
    name: 'Binagoongan', 
    image: require('../../assets/images/binagoongan.png'), 
    time: '40 min' 
  },
];

export default function FavouritesScreen() {
  const renderItem = ({ item }: { item: Fav }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      {/* UPDATED: source passed directly as item.image */}
      <Image source={item.image} style={styles.img} />
      
      {/* Absolute positioned heart icon */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FDF7F0' 
  } as ViewStyle,
  headerArea: { 
    paddingHorizontal: 5, 
    paddingVertical: 20 
  } as ViewStyle,
  title: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: '#333' 
  } as TextStyle,
  subtitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    marginTop: 2,
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
    width: '48%', // Slightly wider to balance the row
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
    height: 150, 
    resizeMode: 'cover'
  } as ImageStyle,
  heartBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  cardContent: {
    padding: 12,
  } as ViewStyle,
  name: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#333' 
  } as TextStyle,
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  } as ViewStyle,
  infoText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  } as TextStyle,
});