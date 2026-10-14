import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '../../../src/theme';

export default function JourneyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.backgroundDeep },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
