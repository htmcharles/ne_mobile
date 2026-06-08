import React, { useEffect, useRef } from "react";
import { Animated, Easing, View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../contexts/ThemeContext";

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "not-found";
}

const NotFoundIllustration: React.FC = () => {
  const ring = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.parallel([
      Animated.loop(
        Animated.timing(ring, {
          toValue: 1,
          duration: 5200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bob, {
            toValue: -6,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(bob, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 900,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(float, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(float, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]);

    loop.start();
    return () => loop.stop();
  }, [bob, pulse, ring]);

  const rotate = ring.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });
  const floatY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <View style={styles.illustrationWrap}>
      <Animated.View
        style={[
          styles.illustrationRing,
          {
            transform: [{ rotate }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.illustrationCore,
          {
            transform: [{ translateY: bob }],
          },
        ]}
      >
        <View style={styles.bookMark} />
        <MaterialCommunityIcons name="book-open-variant" size={40} color="#0F3D45" />
      </Animated.View>
      <Animated.View
        style={[
          styles.illustrationPulse,
          {
            transform: [{ scale: pulseScale }, { translateY: floatY }],
          },
        ]}
      >
        <MaterialCommunityIcons name="magnify" size={28} color="#FFFFFF" />
      </Animated.View>
    </View>
  );
};

const EmptyState: React.FC<Props> = ({
  icon = "inbox-outline",
  title,
  subtitle,
  actionLabel,
  onAction,
  variant = "default",
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      {variant === "not-found" ? (
        <NotFoundIllustration />
      ) : (
        <MaterialCommunityIcons name={icon as any} size={64} color={theme.colors.onSurfaceVariant} />
      )}
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  title: { marginTop: 16, fontWeight: "600" },
  subtitle: { marginTop: 8, textAlign: "center" },
  button: { marginTop: 20, borderRadius: 8 },
  illustrationWrap: {
    width: 156,
    height: 156,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  illustrationRing: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 2,
    borderColor: "rgba(15, 61, 69, 0.18)",
  },
  illustrationCore: {
    width: 108,
    height: 108,
    borderRadius: 28,
    backgroundColor: "rgba(15, 61, 69, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(15, 61, 69, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  illustrationPulse: {
    position: "absolute",
    right: 22,
    top: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0F3D45",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  bookMark: {
    position: "absolute",
    top: 14,
    width: 28,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15, 61, 69, 0.22)",
  },
});

export default EmptyState;
