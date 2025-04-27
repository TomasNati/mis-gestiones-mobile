import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/lib/components/HapticTab";
import TabBarBackground from "@/lib/components/TabBarBackground";
import { Colors } from "@/lib/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finanzas"
        options={{
          title: "finanzas",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="attach-money" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tomi"
        options={{
          title: "Tomi",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="face" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
