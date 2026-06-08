import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { DictionaryProvider } from "./src/contexts/DictionaryContext";
import { ThemeProvider, useAppTheme } from "./src/contexts/ThemeContext";
import RootNavigator from "./src/navigation/RootNavigator";
import ErrorBoundary from "./src/components/ErrorBoundary";
import OnboardingModal from "./src/components/OnboardingModal";

function AppContent() {
  const { theme, isDark } = useAppTheme();
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer
        theme={{
          dark: isDark,
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.onSurface,
            border: theme.colors.outline,
            notification: theme.colors.error,
          },
          fonts: {
            regular: { fontFamily: "System", fontWeight: "400" },
            medium: { fontFamily: "System", fontWeight: "500" },
            bold: { fontFamily: "System", fontWeight: "700" },
            heavy: { fontFamily: "System", fontWeight: "900" },
          },
        }}
      >
        <DictionaryProvider>
          <RootNavigator />
        </DictionaryProvider>
      </NavigationContainer>
      <OnboardingModal visible={showOnboarding} onDone={() => setShowOnboarding(false)} />
      <StatusBar style={isDark ? "light" : "dark"} />
      <Toast />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
