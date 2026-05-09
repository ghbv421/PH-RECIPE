import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, Platform, 
  TouchableOpacity, Modal, Pressable 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SharedHeaderProps {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  // New props to handle category filtering
  onCategorySelect?: (category: string) => void;
  activeCategory?: string;
}

export const SharedHeader = ({ 
  searchQuery = '', 
  onSearchChange,
  onCategorySelect,
  activeCategory = 'All'
}: SharedHeaderProps) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false); // Task 1: UI State

  const categories = ['All', 'Rice', 'Meat', 'Vegetable'];

  const handleSelect = (cat: string) => {
    onCategorySelect?.(cat);
    setModalVisible(false); // Close modal after selection
  };

  return (
    <View style={styles.headerContainer}>
      {/* Top Row (Logo & Icons) */}
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoPH}>PH</Text>
          <Text style={styles.logoRecipe}>RECIPE</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.langWrapper} activeOpacity={0.7}>
            <Feather name="globe" size={18} color="#555" />
            <Text style={styles.langText}>ENG</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Feather name="bell" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconCircle} 
            onPress={() => router.push('/profile/profile_details')}
          >
            <Feather name="user" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Filter Row */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#FF8C00" />
          <TextInput 
            placeholder="Search delicious recipes..." 
            placeholderTextColor="#999"
            style={styles.searchInput} 
            value={searchQuery}
            onChangeText={(text) => onSearchChange?.(text)}
          />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Feather 
              name="sliders" 
              size={18} 
              color={activeCategory !== 'All' ? "#FF8C00" : "#888"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* TASK 2: Filter Modal (Controlled UI Component) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.filterMenu}>
            <Text style={styles.filterTitle}>Filter by Category</Text>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                style={[
                  styles.filterOption,
                  activeCategory === cat && styles.activeOption
                ]}
                onPress={() => handleSelect(cat)}
              >
                <Text style={[
                  styles.filterText,
                  activeCategory === cat && styles.activeFilterText
                ]}>{cat}</Text>
                {activeCategory === cat && <Feather name="check" size={16} color="#FFF" />}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { backgroundColor: '#FDF7F0', paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 15 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 20 },
  logoContainer: { flexDirection: 'column' },
  logoPH: { fontSize: 26, fontWeight: '900', color: '#FF8C00', lineHeight: 24 },
  logoRecipe: { fontSize: 22, fontWeight: '900', color: '#333', marginTop: -4 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  langWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginRight: 10, elevation: 2 },
  langText: { fontSize: 12, fontWeight: '800', marginLeft: 4, color: '#555' },
  iconCircle: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8, elevation: 2 },
  searchSection: { paddingHorizontal: 20 },
  searchBar: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 15, height: 50, alignItems: 'center', elevation: 4 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '600', color: '#333' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  filterMenu: { width: 250, backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 10 },
  filterTitle: { fontSize: 18, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
  filterOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10, marginBottom: 5 },
  activeOption: { backgroundColor: '#FF8C00' },
  filterText: { fontSize: 16, fontWeight: '600', color: '#333' },
  activeFilterText: { color: '#FFF' },
});