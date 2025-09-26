// app/layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/auth.context';
import React from 'react';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
            </Stack>
        </AuthProvider>
    </SafeAreaProvider>
  );
}