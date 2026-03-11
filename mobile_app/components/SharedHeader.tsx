import React from 'react';
import { StyleSheet, Text, View, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SharedHeader = () => {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.logoPH}>PH</Text>
          <Text style={styles.logoRecipe}>RECIPE</Text>
        </View>
        <View style={styles.headerIcons}>
          <View style={styles.langWrapper}>
            <Ionicons name="globe-outline" size={22} color="black" />
            <Text style={styles.langText}>ENG</Text>
          </View>
          <Ionicons name="settings-outline" size={24} color="black" style={styles.iconGap} />
          <Ionicons name="person-circle-outline" size={28} color="black" />
        </View>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="black" />
        <TextInput 
          placeholder="Search for recipes" 
          placeholderTextColor="#666"
          style={styles.searchInput} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: { backgroundColor: '#FFB347', paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 15, zIndex: 1000 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 15 },
  logoPH: { fontSize: 28, fontWeight: '900', color: '#FF4500', fontFamily: 'serif', lineHeight: 26 },
  logoRecipe: { fontSize: 24, fontWeight: '900', color: '#FF4500', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  langWrapper: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  langText: { fontSize: 14, fontWeight: 'bold', marginLeft: 4, fontFamily: 'serif' },
  iconGap: { marginRight: 15 },
  searchBar: { flexDirection: 'row', backgroundColor: '#D3D3D3', marginHorizontal: 20, borderRadius: 15, paddingHorizontal: 15, height: 45, alignItems: 'center' },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: 'serif' },
});