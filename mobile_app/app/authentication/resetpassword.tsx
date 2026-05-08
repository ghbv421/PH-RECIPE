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

export default function ResetPasswordScreen() {
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
            <Text style={styles.headerSubtitle}>Don't worry! Enter your email to recover your account.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Reset Password</Text>

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

            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.sendButton}
              onPress={() => router.push('/authentication/verification')}
            >
              <Text style={styles.sendButtonText}>Send Code</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F0', // Consistent Light Cream
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
    paddingHorizontal: 20,
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
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
    marginBottom: 30,
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
  sendButton: {
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
  sendButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  } as ViewStyle,
  footerText: {
    color: '#777',
    fontSize: 15,
  } as TextStyle,
  signInLink: {
    color: '#FF8C00',
    fontWeight: '700',
    fontSize: 15,
  } as TextStyle,
});