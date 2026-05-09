import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SharedHeader } from '../../components/SharedHeader';

const { width } = Dimensions.get('window');

// --- TYPES ---
interface CookingStep {
  title: string;
  description: string;
  duration: number; 
  isTimerRequired: boolean;
}

const STEPS: CookingStep[] = [
  { 
    title: "Sauté Aromatics", 
    description: "Heat oil in the pot. Add ginger, garlic, and onions. Sauté until fragrant and slightly golden.", 
    duration: 180, 
    isTimerRequired: true 
  },
  { 
    title: "Sear the Chicken", 
    description: "Add the chicken pieces to the pot. Cook until the outer layer turns light brown.", 
    duration: 300, 
    isTimerRequired: true 
  },
  { 
    title: "Simmer Rice", 
    description: "Pour in the rice and broth. Bring to a boil, then lower heat to simmer.", 
    duration: 900, 
    isTimerRequired: true 
  },
  { 
    title: "Garnish & Serve", 
    description: "Top with toasted garlic, green onions, and a hard-boiled egg.", 
    duration: 0, 
    isTimerRequired: false 
  },
];

export default function CookingScreen() {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false); // Controls the Start Button
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(STEPS[0].duration);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [rating, setRating] = useState(5);
  const [isFinished, setIsFinished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted && isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, hasStarted]);

  // Handle Step Changes
  useEffect(() => {
    if (hasStarted) {
      setTimeLeft(STEPS[currentStep].duration);
      if (STEPS[currentStep].isTimerRequired) {
        setIsTimerActive(true);
      }
    }
  }, [currentStep, hasStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartSession = () => {
    setHasStarted(true);
    setIsTimerActive(true);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SharedHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PROGRESS TRACKER */}
        {!isFinished && hasStarted && (
          <View style={styles.tabContainer}>
            {STEPS.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.tabSegment, 
                  index <= currentStep ? styles.tabActive : styles.tabInactive
                ]} 
              />
            ))}
          </View>
        )}

        {!hasStarted ? (
          /* PRE-START UI */
          <View style={styles.prepCard}>
            <Image 
              source={require('../../assets/images/arroz_caldo.png')} 
              style={styles.prepImage} 
            />
            <Text style={styles.prepTitle}>Ready to begin?</Text>
            <Text style={styles.prepSub}>Ensure your IoT Stove is plugged in. The timer will start automatically once you press the button below.</Text>
            <View style={styles.iotStatus}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.iotStatusText}>IoT Hardware Connected</Text>
            </View>
          </View>
        ) : !isFinished ? (
          /* ACTIVE COOKING UI */
          <>
            <View style={styles.card}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP {currentStep + 1}</Text>
              </View>
              <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
              <Text style={styles.stepDescription}>{STEPS[currentStep].description}</Text>
            </View>

            {STEPS[currentStep].isTimerRequired ? (
              <View style={styles.timerWrapper}>
                <View style={styles.timerCircle}>
                  <Text style={styles.timerTime}>{formatTime(timeLeft)}</Text>
                  <Text style={styles.timerLabel}>SYNCED WITH DEVICE</Text>
                </View>
                <View style={styles.pulseContainer}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.autoStartMsg}>IoT Timer is running...</Text>
                </View>
              </View>
            ) : (
              <View style={styles.finishSection}>
                <MaterialCommunityIcons name="chef-hat" size={80} color="#FF8C00" />
                <Text style={styles.finishText}>Final Presentation</Text>
              </View>
            )}
          </>
        ) : (
          /* RATING UI */
          <View style={[styles.card, styles.ratingCard]}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="star-face" size={40} color="#FF8C00" />
            </View>
            <Text style={styles.ratingTitle}>Perfectly Cooked!</Text>
            <Text style={styles.ratingSub}>How was your cooking experience today?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <FontAwesome 
                    name={star <= rating ? "star" : "star-o"} 
                    size={35} 
                    color="#FF8C00" 
                    style={{ marginHorizontal: 6 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        {!hasStarted ? (
          <TouchableOpacity style={styles.actionBtn} onPress={handleStartSession}>
            <Text style={styles.actionBtnText}>Start Cooking Now</Text>
            <MaterialCommunityIcons name="stove" size={24} color="#FFF" />
          </TouchableOpacity>
        ) : !isFinished ? (
          <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
            <Text style={styles.actionBtnText}>
              {currentStep === STEPS.length - 1 ? "Complete Recipe" : "Next Step"}
            </Text>
            <Feather name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => router.replace('/dashboard/recentlyviewed')}
          >
            <Text style={styles.actionBtnText}>Submit & Return</Text>
            <Feather name="check" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF7F0' },
  scrollContent: { padding: 20 },
  
  // Progress Tabs
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 25 },
  tabSegment: { height: 5, width: 50, borderRadius: 10, marginHorizontal: 3 },
  tabActive: { backgroundColor: '#FF8C00' },
  tabInactive: { backgroundColor: '#E0D8CF' },

  // Pre-Start Prep Card
  prepCard: { alignItems: 'center', backgroundColor: '#FFF', borderRadius: 35, padding: 30, elevation: 4 },
  prepImage: { width: 180, height: 180, borderRadius: 90, marginBottom: 20 },
  prepTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A' },
  prepSub: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 10, lineHeight: 22 },
  iotStatus: { flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: '#F0F9F0', padding: 10, borderRadius: 15 },
  iotStatusText: { marginLeft: 8, color: '#4CAF50', fontWeight: '700', fontSize: 13 },

  // Instruction Card
  card: { 
    backgroundColor: '#FFF', borderRadius: 30, padding: 25, elevation: 5, 
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, borderWidth: 1, borderColor: '#F0E6D8' 
  },
  stepBadge: { backgroundColor: '#FFF4E6', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 15 },
  stepBadgeText: { color: '#FF8C00', fontSize: 12, fontWeight: '900' },
  stepTitle: { fontSize: 26, fontWeight: '900', color: '#1A1A1A', marginBottom: 10 },
  stepDescription: { fontSize: 16, color: '#666', lineHeight: 24 },

  // Timer
  timerWrapper: { alignItems: 'center', marginTop: 30 },
  timerCircle: { 
    width: 200, height: 200, borderRadius: 100, backgroundColor: '#FFF', borderWidth: 6, 
    borderColor: '#FF8C00', justifyContent: 'center', alignItems: 'center', elevation: 8 
  },
  timerTime: { fontSize: 48, fontWeight: '900', color: '#1A1A1A' },
  timerLabel: { fontSize: 10, color: '#888', fontWeight: '800', letterSpacing: 1.5, marginTop: 5 },
  pulseContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF8C00', marginRight: 8 },
  autoStartMsg: { color: '#888', fontWeight: '600', fontSize: 14 },

  // Rating UI
  ratingCard: { alignItems: 'center', paddingVertical: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  ratingTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A' },
  ratingSub: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },
  starsRow: { flexDirection: 'row', marginTop: 25 },

  // Footer
  footer: { padding: 20, backgroundColor: '#FDF7F0' },
  actionBtn: { 
    backgroundColor: '#FF8C00', height: 65, borderRadius: 22, flexDirection: 'row', 
    justifyContent: 'center', alignItems: 'center', elevation: 8 
  },
  actionBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900', marginRight: 10 },
  finishSection: { alignItems: 'center', marginTop: 40 },
  finishText: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginTop: 10 }
});