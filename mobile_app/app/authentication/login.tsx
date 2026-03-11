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
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>PH RECIPE</Text>
        
        <Text style={styles.loginText}>LogIn</Text>

        <Text style={styles.label}>Email:</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email" size={20} color="black" style={styles.icon} />
          <TextInput 
            placeholder="usernmae@gmail.com" 
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

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

        <TouchableOpacity onPress={() => router.push('/authentication/resetpassword')}>
          <Text style={styles.forgotText}>Forget Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity 
          style={styles.signInButton} 
          onPress={() => {
            // In a real app, you would add your authentication logic here
            // For now, we go straight to the dashboard
            router.replace('/dashboard/home');
          }}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or continue with</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialBox}>
            <Ionicons name="logo-google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBox}>
            <FontAwesome name="phone" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBox}>
            <FontAwesome name="facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account yet? </Text>
          <TouchableOpacity onPress={() => router.push('/authentication/register')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFDAB9', justifyContent: 'center', paddingHorizontal: 20 },
  card: { backgroundColor: '#FFB347', borderRadius: 30, padding: 30, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#FF4500', textAlign: 'center', fontFamily: 'serif', marginBottom: 20 },
  loginText: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, fontFamily: 'serif' },
  label: { fontSize: 18, marginBottom: 5, fontFamily: 'serif' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFDAB9', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, height: 50 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, fontFamily: 'serif' },
  forgotText: { color: '#FFFFFF', textAlign: 'left', marginBottom: 20, fontFamily: 'serif' },
  signInButton: { backgroundColor: '#FF7F00', paddingVertical: 12, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  signInButtonText: { color: '#000', fontSize: 24, fontWeight: 'bold', fontFamily: 'serif' },
  orText: { textAlign: 'center', color: '#FFFFFF', marginBottom: 20, fontFamily: 'serif' },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 20 },
  socialBox: { backgroundColor: '#FFDAB9', padding: 10, borderRadius: 15, width: 60, alignItems: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontFamily: 'serif', textDecorationLine: 'underline' },
  signUpLink: { color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'serif' },
});