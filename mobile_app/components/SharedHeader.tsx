import React from 'react';
import { StyleSheet, Text, View, TextInput, Platform, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 1. Import useRouter

export const SharedHeader = () => {
  const router = useRouter(); // 2. Initialize router

  return (
    <View style={styles.headerContainer}>
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

          {/* 3. Updated Profile Navigation */}
          <TouchableOpacity 
            style={styles.iconCircle} 
            onPress={() => router.push('/profile/profile_details')}
          >
            <Feather name="user" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#FF8C00" />
          <TextInput 
            placeholder="Search delicious recipes..." 
            placeholderTextColor="#999"
            style={styles.searchInput} 
          />
          <TouchableOpacity>
            <Feather name="sliders" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FDF7F0',
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logoPH: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FF8C00',
    lineHeight: 24,
    letterSpacing: -1,
  },
  logoRecipe: {
    fontSize: 22,
    fontWeight: '900',
    color: '#333',
    marginTop: -4,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  langText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
    color: '#555',
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchSection: {
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 50,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});