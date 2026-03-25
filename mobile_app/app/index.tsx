import React from 'react';
import { Text, View, TouchableOpacity, ViewStyle, TextStyle, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.layout}>
      {/* Decorative Background Element for "Vibes" */}
      <View style={styles.circleDecorator} />
      
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.brandText}>PH</Text>
          <Text style={[styles.brandText, { color: '#333' }]}>RECIPE</Text>
          <View style={styles.underline} />
        </View>

        <Text style={styles.subtitle}>
          Authentic Filipino flavors, {"\n"}right at your fingertips.
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            activeOpacity={0.8}
            style={[styles.button, styles.primaryButton]} 
            onPress={() => router.push('/authentication/login')}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => router.push('/authentication/register')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = {
  layout: {
    flex: 1,
    backgroundColor: '#FDF7F0', // A lighter, creamier version of your beige
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  circleDecorator: {
    position: 'absolute',
    top: -width * 0.2,
    right: -width * 0.2,
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: '#EEE7DA', // Matches your sidebar color
    opacity: 0.5,
  } as ViewStyle,
  contentWrapper: {
    width: '85%',
    alignItems: 'center',
    zIndex: 2,
  } as ViewStyle,
  titleSection: {
    marginBottom: 20,
    alignItems: 'center',
  } as ViewStyle,
  brandText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FF8C00', // Deep Orange from your logo
    fontFamily: 'System', // Use 'Georgia' if linked
    lineHeight: 70,
    letterSpacing: -3,
  } as TextStyle,
  underline: {
    width: 60,
    height: 6,
    backgroundColor: '#FF8C00',
    marginTop: 10,
    borderRadius: 3,
  } as ViewStyle,
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 60,
    fontFamily: 'System',
    lineHeight: 24,
  } as TextStyle,
  buttonGroup: {
    width: '100%',
    gap: 15,
  } as ViewStyle,
  button: {
    height: 60,
    borderRadius: 18, // Matches your recipe card rounding
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  } as ViewStyle,
  primaryButton: {
    backgroundColor: '#FF8C00',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  } as ViewStyle,
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
  } as ViewStyle,
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  } as TextStyle,
  secondaryButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  } as TextStyle,
};