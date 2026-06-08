import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, List, Surface, Switch, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../contexts/ThemeContext";
import { appConfig } from "../../config/appConfig";

const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useAppTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={0}>
        <MaterialCommunityIcons name="book-open-page-variant-outline" size={58} color="#FFFFFF" />
        <Text variant="headlineMedium" style={styles.name}>
          {appConfig.appName}
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Dictionary Mobile Application
        </Text>
      </Surface>

      <View style={styles.content}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={0}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Settings
          </Text>

          <List.Item
            title="Dark mode"
            description={isDark ? "Dark theme active" : "Light theme active"}
            left={(props) => (
              <List.Icon {...props} icon={isDark ? "weather-night" : "white-balance-sunny"} />
            )}
            right={() => <Switch value={isDark} onValueChange={toggleTheme} />}
          />

          <Divider />

          <List.Item
            title="Dictionary API"
            description={appConfig.apiBaseUrl}
            descriptionNumberOfLines={2}
            left={(props) => <List.Icon {...props} icon="api" />}
          />
        </Surface>

        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={0}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Features
          </Text>

          <List.Item
            title="Word definitions"
            description="Parts of speech, definitions, examples, and multiple meanings."
            left={(props) => <List.Icon {...props} icon="text-box-search-outline" />}
          />
          <Divider />
          <List.Item
            title="Pronunciation"
            description="Audio playback appears when the API provides a sound file."
            left={(props) => <List.Icon {...props} icon="volume-high" />}
          />
          <Divider />
          <List.Item
            title="Search history"
            description="Successful searches are saved locally without duplicates."
            left={(props) => <List.Icon {...props} icon="history" />}
          />
        </Surface>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingTop: 58,
    paddingBottom: 34,
  },
  name: { color: "#FFFFFF", fontWeight: "900", marginTop: 10 },
  subtitle: { color: "rgba(255,255,255,0.86)", marginTop: 4 },
  content: { padding: 16 },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
});

export default ProfileScreen;
