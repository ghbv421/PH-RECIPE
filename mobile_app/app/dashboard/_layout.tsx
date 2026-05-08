import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  LayoutChangeEvent,
  Platform,
} from "react-native";
import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const INDICATOR_SIZE = 55; // Slightly smaller for a sleeker look
const ICON_LIFT = -24;
const CIRCLE_LIFT = -32;

function AnimatedTabBarIcon({ name, color, size, focused, iconComponent: Icon }: any) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: focused ? ICON_LIFT : 0,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Icon name={name} size={size} color={focused ? "#FFFFFF" : "#555"} />
    </Animated.View>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const handleLayout = (event: LayoutChangeEvent) =>
    setTabBarWidth(event.nativeEvent.layout.width);

  useEffect(() => {
    if (tabBarWidth === 0) return;
    const tabWidth = tabBarWidth / state.routes.length;
    const toX = state.index * tabWidth + tabWidth / 2 - INDICATOR_SIZE / 2;

    Animated.spring(translateX, {
      toValue: toX,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
    }).start();
  }, [state.index, tabBarWidth]);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar} onLayout={handleLayout}>
        {tabBarWidth > 0 && (
          <Animated.View style={[styles.circleIndicator, { transform: [{ translateX }] }]} />
        )}

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => { if (!isFocused) navigation.navigate(route.name); };

          const config = {
            home: { name: "home-sharp", lib: Ionicons, label: "Home" },
            categories: { name: "grid-sharp", lib: Ionicons, label: "Menu" },
            favourites: { name: "heart-sharp", lib: Ionicons, label: "Favs" },
            popularfood: { name: "flame-sharp", lib: Ionicons, label: "Hot" },
            recentlyviewed: { name: "time-sharp", lib: Ionicons, label: "Recent" },
          }[route.name] || { name: "help-circle", lib: Ionicons, label: route.name };

          return (
            <TouchableWithoutFeedback key={route.key} onPress={onPress}>
              <View style={styles.tab}>
                <AnimatedTabBarIcon
                  name={config.name}
                  iconComponent={config.lib}
                  color="#888"
                  size={22}
                  focused={isFocused}
                />
                <Text style={[styles.label, { color: isFocused ? "#FF8C00" : "#888", opacity: isFocused ? 1 : 0.6 }]}>
                  {config.label}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
}

export default function DashboardLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="categories" />
      <Tabs.Screen name="favourites" />
      <Tabs.Screen name="popularfood" />
      <Tabs.Screen name="recentlyviewed" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
  },
  tabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#FFFFFF", // Clean white background
    borderRadius: 30,
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15 },
      android: { elevation: 10 },
    }),
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
  circleIndicator: {
    position: "absolute",
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    backgroundColor: "#FF8C00", // Consistent Orange accent
    borderRadius: INDICATOR_SIZE / 2,
    top: CIRCLE_LIFT,
    elevation: 5,
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: -2,
  },
});