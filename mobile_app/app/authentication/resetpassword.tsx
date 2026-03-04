import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ResetPasswordScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        
        {/* Header with Blue Underline */}
        <View style={styles.headerUnderline}>
          <Text style={styles.headerTitle}>Reset Password</Text>
        </View>

        {/* Email Input */}
        <Text style={styles.label}>Email:</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email" size={24} color="black" style={styles.icon} />
          <TextInput 
            placeholder="Enter your email" 
            style={styles.input}
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity 
        style={styles.sendButton}
        onPress={() => router.push('/authentication/verification')}
        >
        <Text style={styles.sendButtonText}>Send Code</Text>
        </TouchableOpacity>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => router.push('/authentication/login')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDAB9', // Peach Background
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFB347', // Warm Orange Card
    borderRadius: 30,
    padding: 30,
    paddingVertical: 60,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  headerUnderline: {
    alignSelf: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#0047AB', // Blue underline to match the design
    marginBottom: 50,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif',
    paddingBottom: 2,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'serif',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDAB9', // Lighter peach for input
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 45,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'serif',
  },
  sendButton: {
    backgroundColor: '#FF7F00', // Solid Orange Button
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  sendButtonText: {
    color: '#000',
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'serif',
    fontSize: 16,
  },
  signInLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});