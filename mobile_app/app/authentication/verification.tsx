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

export default function VerificationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        
        <Text style={styles.headerTitle}>Verification code</Text>

        {/* Verification Input Area */}
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="enter your verification code" 
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            keyboardType="number-pad" // Better for entering numeric codes
            textAlign="center"
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => {
            // This is where you'd verify the code logic
            console.log("Verifying code...");
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        {/* Resend Link */}
        <TouchableOpacity style={styles.resendContainer}>
          <Text style={styles.resendText}>Resend code.</Text>
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
    paddingVertical: 80, // Taller padding to match your image
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif',
    marginBottom: 60,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#FFDAB9',
    borderRadius: 15,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    marginBottom: 60,
  },
  input: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#000',
    paddingHorizontal: 10,
  },
  nextButton: {
    backgroundColor: '#FF7F00',
    paddingVertical: 14,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  resendContainer: {
    marginTop: 10,
  },
  resendText: {
    fontSize: 18,
    fontFamily: 'serif',
    textDecorationLine: 'underline',
    color: '#000',
  },
});