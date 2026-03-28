import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();

  // --- 1. State Management ---
  // These variables store what the user types in real-time.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- 2. Validation Logic ---
  const handleLogin = () => {
    // This pattern checks for: [text] @ [text] . [text]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      // Show error only if the format is technically incorrect
      setError("Please use a valid email format (e.g., name@example.com)");
    } else {
      // Clear errors and enter the app
      setError('');
      router.replace('/dashboard/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.brandText}>
              PH <Text style={{ color: '#333' }}>RECIPE</Text>
            </Text>
            <Text style={styles.headerSubtitle}>Welcome back! Enter an email to start cooking.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.loginTitle}>Sign In</Text>

            {/* --- 3. UI Error Feedback --- */}
            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color="#D32F2F" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email Input */}
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, error ? styles.inputErrorBorder : null]}>
              <Feather name="mail" size={18} color="#999" style={styles.icon} />
              <TextInput 
                placeholder="email@example.com" 
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#BBB"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(''); // Clear error message as user types
                }}
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
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.signInButton} 
              onPress={handleLogin}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/authentication/register')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF7F0' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 25 },
  headerSection: { marginBottom: 30, alignItems: 'center' },
  brandText: { fontSize: 42, fontWeight: '900', color: '#FF8C00' },
  headerSubtitle: { fontSize: 14, color: '#888', textAlign: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, elevation: 4 },
  loginTitle: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: '#444', marginBottom: 8, textTransform: 'uppercase' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, height: 56, borderWidth: 1, borderColor: '#EEE' },
  input: { flex: 1, fontSize: 16, color: '#333' },
  icon: { marginRight: 12 },
  signInButton: { backgroundColor: '#FF8C00', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  signInButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#777', fontSize: 15 },
  signUpLink: { color: '#FF8C00', fontWeight: '700', fontSize: 15 },
  // Error Message Styles
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', padding: 12, borderRadius: 8, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#D32F2F' },
  errorText: { color: '#D32F2F', fontSize: 13, fontWeight: '600', marginLeft: 8 },
  inputErrorBorder: { borderColor: '#D32F2F' }
});