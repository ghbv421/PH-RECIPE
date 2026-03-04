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
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>Sign Up</Text>

        {/* Name Input */}
        <Text style={styles.label}>Name:</Text>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="user-circle" size={20} color="black" style={styles.icon} />
          <TextInput 
            placeholder="Full Name" 
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        {/* Email Input */}
        <Text style={styles.label}>Email:</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email" size={20} color="black" style={styles.icon} />
          <TextInput 
            placeholder="usernmae@gmail.com" 
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        {/* Password Input */}
        <Text style={styles.label}>Password:</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="black" style={styles.icon} />
          <TextInput 
            placeholder="password" 
            secureTextEntry 
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>I agree with </Text>
          <TouchableOpacity>
            <Text style={[styles.termsText, styles.underline]}>terms and conditions.</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDAB9',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFB347',
    borderRadius: 30,
    padding: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'serif',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'serif',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDAB9',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
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
  termsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  termsText: {
    fontFamily: 'serif',
    fontSize: 14,
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },
  signUpButton: {
    backgroundColor: '#FF7F00',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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