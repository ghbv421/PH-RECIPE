import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileDetails() {
  const router = useRouter();

  // Basic Settings Action
  const openSettings = () => {
    Alert.alert("Settings", "Configure your app preferences, security, and data usage.");
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.topBlur} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.glassBtn}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Food Journey</Text>
        
        {/* The Settings Icon: Now functional */}
        <TouchableOpacity style={styles.glassBtn} onPress={openSettings}>
          <Feather name="settings" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card */}
        <View style={styles.avatarSection}>
          <View style={styles.imageContainer}>
            <View style={styles.avatarRing}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/300' }} 
                style={styles.avatar} 
              />
            </View>
            <View style={styles.badgeIcon}>
              <MaterialCommunityIcons name="silverware-clean" size={14} color="#FFF" />
            </View>
          </View>
          {/* cspell:disable-next-line */}
          <Text style={styles.userName}>Akimitsu</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Active Foodie</Text>
          </View>
        </View>

        {/* User Stats */}
        <View style={styles.statsCard}>
          <StatItem label="Saved" value="45" />
          <View style={styles.divider} />
          <StatItem label="Cooked" value="28" />
          <View style={styles.divider} />
          <StatItem label="Liked" value="156" />
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionLabel}>My Activity</Text>
          <ModernMenuItem 
            icon="heart" 
            title="Saved Recipes" 
            sub="Your collection of tastes" 
            onPress={() => router.push('/favourites' as any)} 
          />
          <ModernMenuItem 
            icon="check-circle" 
            title="Cooking History" 
            sub="28 recipes completed" 
            onPress={() => router.push('/recentlyviewed' as any)} 
          />

          {/* New Basic Profile Settings */}
          <Text style={[styles.sectionLabel, { marginTop: 25 }]}>App Settings</Text>
          
          <ModernMenuItem 
            icon="bell" 
            title="Notifications" 
            sub="Recipe alerts & reminders" 
          />
          
          <ModernMenuItem 
            icon="globe" 
            title="Language" 
            sub="English (US)" 
          />

          <ModernMenuItem 
            icon="eye" 
            title="Appearance" 
            sub="Light Mode" 
          />

          <TouchableOpacity 
            style={styles.logoutAction}
            onPress={() => router.replace('/' as any)}
          >
            <Feather name="log-out" size={18} color="#FF4B4B" />
            <Text style={styles.logoutLabel}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ModernMenuItem = ({ icon, title, sub, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuIconBox}>
      <Feather name={icon} size={20} color="#FF8C00" />
    </View>
    <View style={styles.menuTextContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSub}>{sub}</Text>
    </View>
    <Feather name="chevron-right" size={18} color="#DDD" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF7F0' },
  topBlur: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 140, 0, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  glassBtn: {
    width: 45,
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  scrollContent: { paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginTop: 30 },
  imageContainer: { position: 'relative' },
  avatarRing: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#FDF7F0' },
  badgeIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF8C00',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FDF7F0',
  },
  userName: { fontSize: 26, fontWeight: '900', color: '#333', marginTop: 15 },
  tag: {
    backgroundColor: 'rgba(255, 140, 0, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  tagText: { color: '#FF8C00', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 35,
    borderRadius: 30,
    paddingVertical: 25,
    elevation: 8,
    shadowColor: '#FF8C00',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', color: '#333' },
  statLabel: { fontSize: 12, color: '#AAA', fontWeight: '600', marginTop: 2 },
  divider: { width: 1, height: '60%', backgroundColor: '#F0F0F0', alignSelf: 'center' },
  menuContainer: { marginTop: 35, paddingHorizontal: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#CCC', marginLeft: 10, marginBottom: 15, letterSpacing: 1 },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02,
  },
  menuIconBox: {
    width: 45,
    height: 45,
    backgroundColor: '#FDF7F0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContent: { flex: 1, marginLeft: 15 },
  menuTitle: { fontSize: 16, fontWeight: '800', color: '#333' },
  menuSub: { fontSize: 12, color: '#AAA', fontWeight: '500', marginTop: 2 },
  logoutAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 20,
  },
  logoutLabel: { color: '#FF4B4B', fontWeight: '800', marginLeft: 10, fontSize: 15 },
});