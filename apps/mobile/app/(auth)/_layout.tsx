import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '../../src/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.backgroundDeep },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="error" />
      <Stack.Screen name="signed-out" />
    </Stack>
  );
}
