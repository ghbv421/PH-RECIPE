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
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Fav { id: string; name: string; image: string; time: string; }

const FAVS: Fav[] = [
  { id: '1', name: 'Garlic Rice', image: 'https://images.unsplash.com/photo-1512058560366-cd2427ffeb56', time: '15 min' },
  { id: '2', name: 'Arroz Caldo', image: 'https://images.unsplash.com/photo-1626777553732-48995a67f0f6', time: '30 min' },
  { id: '3', name: 'Sinigang', image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f', time: '45 min' },
  { id: '4', name: 'Adobo', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', time: '40 min' },
];

export default function FavouritesScreen() {
  const renderItem = ({ item }: { item: Fav }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.img} />
      
      {/* Absolute positioned heart icon */}
      <View style={styles.heartBadge}>
        <Feather name="heart" size={14} color="white" fill="#FF4B4B" />
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
    width: '47%', 
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