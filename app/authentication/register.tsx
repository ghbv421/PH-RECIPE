import React from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ViewStyle, 
  TextStyle, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join PH Recipe and start cooking!</Text>
          </View>

          <View style={styles.card}>
            {/* Name Input */}
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={18} color="#999" style={styles.icon} />
              <TextInput 
                placeholder="Your Name" 
                style={styles.input}
                placeholderTextColor="#BBB"
              />
            </View>

            {/* Email Input */}
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={18} color="#999" style={styles.icon} />
              <TextInput 
                placeholder="email@example.com" 
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#BBB"
              />
            </View>

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="#999" style={styles.icon} />
              <TextInput 
                placeholder="••••••••" 
                secureTextEntry 
                style={styles.input}
                placeholderTextColor="#BBB"
              />
            </View>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>By signing up, you agree to our </Text>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.signUpButton}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Footer Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/authentication/login')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Using StyleSheet.create for cleaner Type Inference ---
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
    alignItems: 'flex-start',
  } as ViewStyle,
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#333',
    letterSpacing: -1,
  } as TextStyle,
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  } as TextStyle,
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  } as ViewStyle,
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle,
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 56,
    borderWidth: 1,
    borderColor: '#EEE',
  } as ViewStyle,
  icon: {
    marginRight: 12,
    // Fix: Icons expect TextStyle, not ViewStyle
  } as TextStyle, 
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  } as TextStyle,
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
    justifyContent: 'center',
  } as ViewStyle,
  termsText: {
    fontSize: 13,
    color: '#777',
  } as TextStyle,
  termsLink: {
    fontSize: 13,
    color: '#FF8C00',
    fontWeight: '600',
  } as TextStyle,
  signUpButton: {
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
    marginBottom: 20,
  } as ViewStyle,
  signUpButtonText: {
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
    fontSize: 15,
    color: '#777',
  } as TextStyle,
  signInLink: {
    fontSize: 15,
    color: '#FF8C00',
    fontWeight: '700',
  } as TextStyle,
});