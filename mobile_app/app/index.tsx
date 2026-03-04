import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>PH</Text>
        <Text style={styles.titleText}>RECIPE</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/authentication/login')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.signUpButton]} 
          onPress={() => router.push('/authentication/register')}
        >
          <Text style={styles.buttonText}>Sign up an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDAB9', // Peach background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  titleContainer: {
    marginBottom: 80,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FF4500', // Bright orange/red for text
    fontFamily: 'serif', // Matches the serif look in your image
    lineHeight: 70,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#F2994A', // Lighter orange button
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  signUpButton: {
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'serif',
  },
});