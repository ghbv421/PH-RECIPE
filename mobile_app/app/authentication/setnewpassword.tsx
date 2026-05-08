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

export default function SetNewPasswordScreen() {
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
            <Text style={styles.headerSubtitle}>Create a strong password to keep your account secure.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>New Password</Text>

            {/* New Password Input */}
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="#999" style={styles.icon} />
              <TextInput 
                placeholder="••••••••" 
                secureTextEntry 
                style={styles.input}
                placeholderTextColor="#BBB"
              />
            </View>

            {/* Confirm Password Input */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="check-circle" size={18} color="#999" style={styles.icon} />
              <TextInput 
                placeholder="••••••••" 
                secureTextEntry 
                style={styles.input}
                placeholderTextColor="#BBB"
              />
            </View>

            {/* Confirm Button */}
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.confirmButton}
              onPress={() => {
                // Password update logic here
                router.replace('/authentication/login');
              }}
            >
              <Text style={styles.confirmButtonText}>Update Password</Text>
            </TouchableOpacity>

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
    paddingVertical: 40,
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
    marginBottom: 20,
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
  confirmButton: {
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
    marginTop: 10,
  } as ViewStyle,
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  } as TextStyle,
});