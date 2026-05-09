import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image,
  FlatList, SafeAreaView, ActivityIndicator, Alert,
  TouchableOpacity, Modal, Animated, Dimensions, PanResponder
} from 'react-native';
import { SharedHeader } from '../../components/SharedHeader';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

/** * CONNECTION CONFIG */
const IP_ADDRESS = '192.168.1.37';
const BASE_URL = `http://${IP_ADDRESS}:8000/api`;

// --- IMAGE MAPPER ---
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
  category: string;
  time: string;
  rating: number;
  ingredients?: string[]; 
}

const RecipeItem = ({ name, image, onPress }: { name: string; image: string; onPress: () => void; }) => {
  const cleanedKey = image ? image.replace('.png', '').replace('.jpg', '') : 'arroz_caldo';
  const imageSource = RecipeImages[cleanedKey] || { uri: 'https://placehold.co/100x100.png' };

  return (
    <TouchableOpacity style={styles.recipeCard} onPress={onPress}>
      <Image source={imageSource} style={styles.thumb} />
      <Text style={styles.recipeName}>{name}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          setSelectedRecipe(null);
          pan.setValue({ x: 0, y: 0 });
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    fetch(`${BASE_URL}/recipes/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError('Connection failed. Is your Django server running?');
        setLoading(false);
      });
  }, []);

  const addRecipe = (newRecipeData: any) => {
    fetch(`${BASE_URL}/recipes/add/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipeData),
    })
      .then(async (res) => {
        if (res.status === 403) {
            Alert.alert("Permission Denied", "Django is blocking this POST. Change @permission_classes to [AllowAny] for testing.");
            return;
        }
        if (!res.ok) {
            const errBody = await res.json();
            console.log("Validation Error:", errBody);
            throw new Error("Check terminal for details");
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
            Alert.alert('Success', 'Recipe Added!');
            setRecipes((prev) => [...prev, data]);
        }
      })
      .catch((err) => Alert.alert('Error', err.message));
  };

  if (loading) return <ActivityIndicator size="large" color="#000" style={{ marginTop: 100 }} />;
  if (error) return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.heroWrapper}>
          <Image source={{ uri: 'https://placehold.co/600x400.png' }} style={styles.heroImg} />
        </View>

        <Text style={styles.sectionTitle}>Newly Recipes added {'>'}</Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecipeItem
              name={item.name}
              image={item.image_key}
              onPress={() => {
                pan.setValue({ x: 0, y: 0 });
                setSelectedRecipe(item);
              }}
            />
          )}
        />

        <TouchableOpacity
          style={styles.testBtn}
          onPress={() => addRecipe({
            name: 'Mobile Demo',
            category: 'Rice',
            image_key: 'arroz_caldo',
            time: '30m',
            rating: 4.5
          })}
        >
          <Text style={{ fontWeight: 'bold' }}>Demo Add Recipe (Task 4)</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={!!selectedRecipe} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]}>
            {selectedRecipe && (
              <>
                <View style={styles.modalImageWrapper} {...panResponder.panHandlers}>
                  <Image
                    source={RecipeImages[selectedRecipe.image_key?.replace('.png', '')] || { uri: 'https://placehold.co/400x220.png' }}
                    style={styles.modalHeroImage}
                  />
                  <View style={styles.dragHandle} />
                </View>
                <View style={styles.modalScrollBody}>
                  <Text style={styles.modalRecipeTitle}>{selectedRecipe.name}</Text>
                  <View style={styles.infoStrip}>
                    <Text style={styles.infoText}>⭐ {selectedRecipe.rating}</Text>
                    <Text style={styles.infoText}>🕒 {selectedRecipe.time}</Text>
                  </View>
                  <Text style={styles.subtitle}>Ingredients List</Text>
                  <ScrollView style={styles.ingScrollView} nestedScrollEnabled>
                    {selectedRecipe.ingredients?.map((ing, i) => (
                      <View key={i} style={styles.ingRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.ingText}>{ing}</Text>
                      </View>
                    )) || <Text>No ingredients listed in Database.</Text>}
                  </ScrollView>
                  <TouchableOpacity style={styles.ctaButton} onPress={() => setSelectedRecipe(null)}>
                    <Text style={styles.ctaText}>Close</Text>
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
  container: { flex: 1, backgroundColor: '#FFBA74' },
  scrollPadding: { paddingBottom: 100 },
  heroWrapper: { margin: 20, height: 220, borderRadius: 20, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginBottom: 15, fontFamily: 'serif' },
  recipeCard: { marginLeft: 20, alignItems: 'center', width: 100 },
  thumb: { width: 100, height: 100, borderRadius: 15 },
  recipeName: { marginTop: 8, fontFamily: 'serif', fontSize: 13, textAlign: 'center' },
  testBtn: { backgroundColor: '#fff', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', maxHeight: height * 0.85 },
  modalImageWrapper: { width: '100%', height: 220, position: 'relative' },
  modalHeroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  dragHandle: { position: 'absolute', bottom: 10, alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
  modalScrollBody: { padding: 20 },
  modalRecipeTitle: { fontSize: 24, fontWeight: 'bold', fontFamily: 'serif', marginBottom: 8 },
  infoStrip: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  infoText: { fontSize: 15, color: '#555' },
  subtitle: { fontSize: 17, fontWeight: '600', marginBottom: 10 },
  ingScrollView: { maxHeight: 180, marginBottom: 16 },
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFBA74', marginRight: 10 },
  ingText: { fontSize: 14, color: '#333' },
  ctaButton: { backgroundColor: '#FF6B35', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});