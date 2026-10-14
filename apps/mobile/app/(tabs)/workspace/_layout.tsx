import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '../../../src/theme';

export default function WorkspaceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.backgroundDeep },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="reflections" />
      <Stack.Screen name="resources" />
      <Stack.Screen name="gallery" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
