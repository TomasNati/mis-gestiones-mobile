import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/TabBarBackground";
import { Colors } from "@/constants/Colors";
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
          title: "Finanzas",
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
