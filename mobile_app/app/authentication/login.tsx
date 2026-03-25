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
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();

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
            <Text style={styles.headerSubtitle}>Welcome back! Please login to your account.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.loginTitle}>Sign In</Text>

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

            <TouchableOpacity 
              onPress={() => router.push('/authentication/resetpassword')}
              style={styles.forgotContainer}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.signInButton} 
              onPress={() => router.replace('/dashboard/home')}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialBox}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBox}>
                <Ionicons name="logo-apple" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBox}>
                <FontAwesome name="facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
            </View>

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
    marginBottom: 30,
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
    marginTop: 5,
    textAlign: 'center',
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
  loginTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
  } as TextStyle,
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  } as TextStyle,
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 56,
    borderWidth: 1,
    borderColor: '#EEE',
  } as ViewStyle,
  icon: {
    marginRight: 12,
  } as TextStyle,
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  } as TextStyle,
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  } as ViewStyle,
  forgotText: {
    color: '#FF8C00',
    fontWeight: '600',
    fontSize: 14,
  } as TextStyle,
  signInButton: {
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
    marginBottom: 25,
  } as ViewStyle,
  signInButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  } as TextStyle,
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEE',
  } as ViewStyle,
  orText: {
    marginHorizontal: 10,
    color: '#BBB',
    fontSize: 12,
  } as TextStyle,
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 25,
  } as ViewStyle,
  socialBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  } as ViewStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
  footerText: {
    color: '#777',
    fontSize: 15,
  } as TextStyle,
  signUpLink: {
    color: '#FF8C00',
    fontWeight: '700',
    fontSize: 15,
  } as TextStyle,
});