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
  ImageStyle 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Feather } from '@expo/vector-icons';

interface RecentRecipe {
  id: string;
  name: string;
  image: string;
  viewedAt: string;
}

export default function RecentlyViewedScreen({ title = "Recently Viewed" }) {
  const DATA: RecentRecipe[] = [
    { id: '1', name: 'Garlic Rice', image: 'https://images.unsplash.com/photo-1512058560366-cd2427ffeb56', viewedAt: '2h ago' },
    { id: '2', name: 'Arroz Caldo', image: 'https://images.unsplash.com/photo-1626777553732-48995a67f0f6', viewedAt: '5h ago' },
    { id: '3', name: 'Sisig Special', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3', viewedAt: 'Yesterday' },
    { id: '4', name: 'Crispy Lechon', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0', viewedAt: '2 days ago' },
  ];

  const renderItem = ({ item }: { item: RecentRecipe }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.img} />
      
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        
        <View style={styles.timeRow}>
          <Feather name="clock" size={12} color="#888" />
          <Text style={styles.timeText}> {item.viewedAt}</Text>
        </View>
      </View>

      {/* Small subtle indicator that it was viewed */}
      <View style={styles.viewBadge}>
        <Feather name="eye" size={12} color="#FF8C00" />
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
            <TouchableOpacity style={styles.clearBtn}>
              <Text style={styles.clearText}>Clear All</Text>
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
  clearBtn: {
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  } as ViewStyle,
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF8C00',
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
    overflow: 'hidden',
    position: 'relative'
  } as ViewStyle,
  img: { 
    width: '100%', 
    height: 130, 
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
});