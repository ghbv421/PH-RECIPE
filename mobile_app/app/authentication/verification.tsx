import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ViewStyle,
  TextStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function VerificationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.brandText}>PH <Text style={{ color: '#333' }}>RECIPE</Text></Text>
            <Text style={styles.headerSubtitle}>We've sent a 6-digit code to your email address.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Verify Code</Text>

            {/* Verification Input Area */}
            <Text style={styles.label}>Enter Code</Text>
            <View style={styles.inputWrapper}>
              <Feather name="shield" size={18} color="#999" style={styles.icon} />
              <TextInput 
                placeholder="000000" 
                placeholderTextColor="#BBB"
                keyboardType="number-pad"
                maxLength={6}
                // FIX: letterSpacing and textAlign are style properties
                style={[styles.input, { textAlign: 'center', letterSpacing: 8 }]} 
              />
            </View>

            {/* Next Button */}
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.nextButton}
              onPress={() => {
                // Logic for verification
                router.replace('/dashboard/home');
              }}
            >
              <Text style={styles.nextButtonText}>Verify & Proceed</Text>
            </TouchableOpacity>

            {/* Resend Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Didn't receive a code? </Text>
              <TouchableOpacity>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F0', 
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  } as ViewStyle,
  headerSection: {
    marginBottom: 40,
    alignItems: 'center',
  } as ViewStyle,
  brandText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FF8C00',
    letterSpacing: -2,
  } as TextStyle,
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 30,
  } as TextStyle,
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    alignItems: 'center',
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 30,
  } as TextStyle,
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#444',
    marginBottom: 10,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    marginLeft: 4,
  } as TextStyle,
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 40,
    height: 60,
    borderWidth: 1,
    borderColor: '#EEE',
    width: '100%',
  } as ViewStyle,
  icon: {
    marginRight: 10,
  } as TextStyle,
  input: {
    flex: 1,
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#333',
  } as TextStyle,
  nextButton: {
    backgroundColor: '#FF8C00',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    marginBottom: 20,
  } as ViewStyle,
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  footerText: {
    color: '#777',
    fontSize: 15,
  } as TextStyle,
  resendLink: {
    color: '#FF8C00',
    fontWeight: '700',
    fontSize: 15,
  } as TextStyle,
});