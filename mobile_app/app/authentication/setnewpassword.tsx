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

export default function SetNewPasswordScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        
        <Text style={styles.headerTitle}>Set New Password</Text>

        {/* New Password Input */}
        <Text style={styles.label}>Password:</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="enter new password" 
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            secureTextEntry={true}
          />
        </View>

        {/* Confirm Password Input */}
        <Text style={styles.label}>Confirm New Password:</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="confirm new password" 
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            secureTextEntry={true}
          />
        </View>

        {/* Confirm Button */}
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => {
            // Logic to update password would go here
            router.replace('/authentication/login');
          }}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
        
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
    backgroundColor: '#FFB347', // Orange Card
    borderRadius: 30,
    padding: 30,
    paddingVertical: 60,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif',
    marginBottom: 50,
    textAlign: 'center',
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
    fontFamily: 'serif',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#FFDAB9',
    borderRadius: 12,
    width: '100%',
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  input: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#000',
  },
  confirmButton: {
    backgroundColor: '#FF7F00',
    paddingVertical: 14,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
});