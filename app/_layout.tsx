// app/layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { LocationProvider } from '../context/LocationContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
        <AuthProvider>
            <LocationProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="splash" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </LocationProvider>
        </AuthProvider>
    </SafeAreaProvider>
  );
}