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

const INDICATOR_SIZE = 60;
const ICON_LIFT = -22;
const CIRCLE_LIFT = -28;

// 1. Animated Icon Component: Turns WHITE when focused
function AnimatedTabBarIcon({ name, color, size, focused, iconComponent: Icon }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: focused ? ICON_LIFT : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
      <Icon name={name} size={size} color={focused ? "#FFFFFF" : color} />
    </Animated.View>
  );
}

// 2. Custom Tab Bar: Handles the sliding circle and lifting icons
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const handleLayout = (event: LayoutChangeEvent) =>
    setTabBarWidth(event.nativeEvent.layout.width);

  const tabCount = state.routes.length;

  useEffect(() => {
    if (tabBarWidth === 0) return;

    const tabWidth = tabBarWidth / tabCount;
    const toX = state.index * tabWidth + tabWidth / 2 - INDICATOR_SIZE / 2;

    Animated.spring(translateX, {
      toValue: toX,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  }, [state.index, tabBarWidth]);

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar} onLayout={handleLayout}>
        {tabBarWidth > 0 && (
          <Animated.View
            style={[
              styles.circleIndicator,
              { transform: [{ translateX }] },
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };

          const iconConfig = {
            home: { name: "home-sharp", lib: Ionicons, label: "HOME" },
            categories: { name: "layers", lib: Ionicons, label: "CATEGORIES" },
            favourites: { name: "heart-sharp", lib: Ionicons, label: "FAVORITES" },
            popularfood: { name: "local-fire-department", lib: MaterialIcons, label: "POPULAR" },
            recentlyviewed: { name: "eye-sharp", lib: Ionicons, label: "VIEWED" },
          }[route.name] || { name: "help-circle", lib: Ionicons, label: route.name };

          return (
            <TouchableWithoutFeedback key={route.key} onPress={onPress}>
              <View style={styles.tab}>
                <AnimatedTabBarIcon
                  name={iconConfig.name}
                  iconComponent={iconConfig.lib}
                  color="black"
                  size={26}
                  focused={isFocused}
                />
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? "#FFFFFF" : "black", opacity: isFocused ? 1 : 0.7 }
                  ]}
                >
                  {iconConfig.label}
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
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="categories" />
      <Tabs.Screen name="favourites" />
      <Tabs.Screen name="popularfood" />
      <Tabs.Screen name="recentlyviewed" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    height: 70,
  },
  tabBar: {
    flexDirection: "row",
    height: 70,
    alignItems: "center",
    backgroundColor: "#FFBA74", // Updated background color
    borderRadius: 35,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4 },
      android: { elevation: 5 },
    }),
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circleIndicator: {
    position: "absolute",
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    backgroundColor: "#FF4500", 
    borderRadius: INDICATOR_SIZE / 2,
    top: CIRCLE_LIFT, 
    zIndex: 0,
    borderWidth: 3,
    borderColor: "#FFBA74", // Updated to match the bar background
  },
  label: {
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginTop: -5,
  },
});