import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOBILE_THEME } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: MOBILE_THEME.navyButton,
        tabBarInactiveTintColor: MOBILE_THEME.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* 1. Home / Member Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={21} color={color} />
          ),
        }}
      />

      {/* 2. Team Directory */}
      <Tabs.Screen
        name="team"
        options={{
          title: 'Team',
          tabBarLabel: 'Team',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={21} color={color} />
          ),
        }}
      />

      {/* 3. Training Journey */}
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarLabel: 'Journey',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={21} color={color} />
          ),
        }}
      />

      {/* 4. Scoreboard */}
      <Tabs.Screen
        name="scoreboard"
        options={{
          title: 'Scoreboard',
          tabBarLabel: 'Scoreboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={21} color={color} />
          ),
        }}
      />

      {/* 5. More / Workspace Resources */}
      <Tabs.Screen
        name="workspace"
        options={{
          title: 'More',
          tabBarLabel: 'More',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'ellipsis-horizontal-circle' : 'ellipsis-horizontal-circle-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 2,
  },
});
