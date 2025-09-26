import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isLoading } = useAuth();
  const { startLocationTracking } = useLocation();

  // Animation value for fading and translating text
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade-in animation for the text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, // Increased duration for a smoother effect
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Start location tracking in the background
    startLocationTracking();
  }, [fadeAnim, startLocationTracking]);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const timestamp = await AsyncStorage.getItem('usertokenTimestamp');
        const TOKEN_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

        let isValid = false;

        if (storedToken && timestamp) {
          const storedTime = parseInt(timestamp, 10);
          const currentTime = Date.now();

          if (currentTime - storedTime <= TOKEN_EXPIRY_TIME) {
            isValid = true;
          } else {
            // Token expired, remove it
            await AsyncStorage.multiRemove(['token', 'usertokenTimestamp']);
          }
        }

        // Delay navigation to ensure splash screen is visible for a moment
        setTimeout(() => {
          if (isValid) {
            router.replace('/(tabs)');
          } else {
            router.replace('/(auth)/login');
          }
        }, 2500); // 2.5 second splash screen duration
      } catch (err) {
        console.error('Error checking auth:', err);
        router.replace('/(auth)/login');
      }
    };

    // Only check auth once the initial loading state from useAuth is resolved
    if (!isLoading) {
      checkAuthAndNavigate();
    }
  }, [isLoading, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.Text
        style={[
          styles.appName,
          {
            color: colors.text,
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0], // Text slides up from below
                }),
              },
            ],
          },
        ]}
      >
        Ocean Sential
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 48, // Increased font size for better visibility
    fontWeight: 'bold',
    textAlign: 'center',
  },
});