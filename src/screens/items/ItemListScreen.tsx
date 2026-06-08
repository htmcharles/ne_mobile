import React, { useEffect, useMemo, useState } from "react";
import { ImageBackground, Keyboard, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  IconButton,
  Searchbar,
  Surface,
  Text,
} from "react-native-paper";
import Toast from "react-native-toast-message";
import { createAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useRoute } from "@react-navigation/native";
import { useAppTheme } from "../../contexts/ThemeContext";
import { useDictionary } from "../../contexts/DictionaryContext";
import EmptyState from "../../components/EmptyState";
import LoadingIndicator from "../../components/LoadingIndicator";
import { findPhoneticText, getAudioOptions } from "../../services/dictionaryService";

const heroImage = require("../../../assets/lexidict-hero.png");

const ItemListScreen = ({ navigation }: any) => {
  const { theme } = useAppTheme();
  const route = useRoute<any>();
  const { entries, currentWord, error, isLoading, searchWord } = useDictionary();
  const [query, setQuery] = useState("");
  const [selectedAudioIndex, setSelectedAudioIndex] = useState(0);

  const primaryEntry = entries[0] ?? null;
  const phonetic = findPhoneticText(primaryEntry);
  const audioOptions = useMemo(() => getAudioOptions(primaryEntry), [primaryEntry]);
  const selectedAudio = audioOptions[selectedAudioIndex] ?? audioOptions[0];
  const audioUrl = selectedAudio?.url || "";
  const player = React.useMemo(
    () => createAudioPlayer(audioUrl || null, { downloadFirst: true }),
    [audioUrl],
  );
  const audioStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    setSelectedAudioIndex(0);
  }, [currentWord]);

  useEffect(() => {
    if (selectedAudioIndex >= audioOptions.length) {
      setSelectedAudioIndex(0);
    }
  }, [audioOptions.length, selectedAudioIndex]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon="menu"
          size={24}
          onPress={() => navigation.getParent()?.openDrawer()}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const word = route.params?.word;
    if (word && word !== currentWord) {
      setQuery(word);
      searchWord(word);
    }
  }, [route.params?.word, currentWord, searchWord]);

  const totalDefinitions = useMemo(
    () =>
      entries.reduce(
        (count, entry) =>
          count +
          entry.meanings.reduce(
            (meaningCount, meaning) => meaningCount + meaning.definitions.length,
            0,
          ),
        0,
      ),
    [entries],
  );

  const handleSearch = async (word = query) => {
    Keyboard.dismiss();
    const normalized = word.trim();
    if (!normalized) {
      Toast.show({
        type: "info",
        text1: "Search field is empty",
        text2: "Enter an English word first.",
      });
      return;
    }
    setQuery(normalized);
    await searchWord(normalized);
  };

  const togglePronunciation = async () => {
    if (!audioUrl) return;

    try {
      if (audioStatus.playing) {
        player.pause();
        return;
      }
      await player.seekTo(0);
      player.play();
    } catch {
      Toast.show({
        type: "error",
        text1: "Audio unavailable",
        text2: "The pronunciation could not be played.",
      });
    }
  };

  const stopPronunciation = async () => {
    try {
      player.pause();
      await player.seekTo(0);
    } catch {
      Toast.show({
        type: "error",
        text1: "Audio unavailable",
        text2: "The pronunciation could not be stopped.",
      });
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <ImageBackground source={heroImage} resizeMode="cover" style={styles.heroImage} imageStyle={styles.heroImageInner}>
        <View style={styles.heroOverlay}>
          <Text variant="headlineSmall" style={styles.heroTitle}>
            LexiDict
          </Text>
          <Text variant="bodyMedium" style={styles.heroSubtitle}>
            A clean pocket dictionary for definitions, examples, and pronunciation.
          </Text>
        </View>
      </ImageBackground>

      <Surface
        style={[styles.searchPanel, { backgroundColor: theme.colors.surface }]}
        elevation={0}
      >
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Find a word
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Search English meanings, pronunciation, parts of speech, and examples.
        </Text>

        <Searchbar
          placeholder="Type a word, e.g. hello"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
          inputStyle={styles.searchInput}
        />

        <Button
          mode="contained"
          icon="magnify"
          onPress={() => handleSearch()}
          loading={isLoading}
          disabled={isLoading}
          style={styles.searchButton}
          contentStyle={styles.searchButtonContent}
        >
          Search
        </Button>
      </Surface>

      {isLoading ? (
        <LoadingIndicator message="Looking up the word..." fullScreen={false} />
      ) : null}

      {!isLoading && error ? (
        <EmptyState
          icon="book-alert-outline"
          title={error.includes("not found") ? "Word not found" : "Search failed"}
          subtitle={error}
          actionLabel={query ? "Try again" : undefined}
          onAction={query ? () => handleSearch() : undefined}
        />
      ) : null}

      {!isLoading && !error && entries.length === 0 ? (
        <EmptyState
          icon="book-search-outline"
          title="No word selected"
          subtitle="Search for an English word to see definitions and examples."
        />
      ) : null}

      {!isLoading && !error && primaryEntry ? (
        <View style={styles.results}>
          <Surface
            style={[styles.wordHeader, { backgroundColor: theme.colors.primaryContainer }]}
            elevation={0}
          >
            <View style={styles.wordTextWrap}>
              <Text
                variant="displaySmall"
                style={[styles.word, { color: theme.colors.onPrimaryContainer }]}
              >
                {primaryEntry.word}
              </Text>
              <View style={styles.phoneticRow}>
                {phonetic ? (
                  <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>
                    {phonetic}
                  </Text>
                ) : null}
                {audioUrl ? (
                  <Button
                    mode="text"
                    compact
                    icon={
                      audioStatus.playing
                        ? "pause"
                        : audioStatus.isBuffering
                          ? "progress-clock"
                          : "play"
                    }
                    loading={audioStatus.isBuffering}
                    disabled={audioStatus.isBuffering}
                    textColor={theme.colors.onPrimaryContainer}
                    onPress={togglePronunciation}
                    style={styles.playButton}
                    contentStyle={styles.playButtonContent}
                  >
                    {audioStatus.playing ? "Pause" : "Play"}
                  </Button>
                ) : null}
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, marginTop: 2 }}>
                {totalDefinitions} definition{totalDefinitions === 1 ? "" : "s"} found
              </Text>
            </View>

            {audioOptions.length > 0 ? (
              <View style={styles.audioControls}>
                <Button
                  mode="text"
                  compact
                  icon="stop"
                  disabled={!audioStatus.playing && audioStatus.currentTime === 0}
                  textColor={theme.colors.onPrimaryContainer}
                  onPress={stopPronunciation}
                  style={styles.stopButton}
                  contentStyle={styles.playButtonContent}
                >
                  Stop
                </Button>
              </View>
            ) : null}
          </Surface>

          {audioOptions.length > 0 ? (
            <Surface
              style={[styles.audioVariants, { backgroundColor: theme.colors.surface }]}
              elevation={0}
            >
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Pronunciations
              </Text>
              <View style={styles.audioVariantRow}>
                {audioOptions.map((option, index) => {
                  const active = selectedAudioIndex === index;
                  return (
                    <Chip
                      key={`${option.url}-${index}`}
                      compact
                      selected={active}
                      icon={active ? "volume-high" : undefined}
                      onPress={() => setSelectedAudioIndex(index)}
                      style={styles.audioVariantChip}
                    >
                      {option.label || `Audio ${index + 1}`}
                    </Chip>
                  );
                })}
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 10 }}>
                Tap one audio chip to choose the exact pronunciation, then tap the speaker icon to play it.
              </Text>
            </Surface>
          ) : null}

          {entries.map((entry, entryIndex) => (
            <View key={`${entry.word}-${entryIndex}`}>
              {entry.meanings.map((meaning, meaningIndex) => (
                <Card
                  key={`${meaning.partOfSpeech}-${meaningIndex}`}
                  style={[
                    styles.meaningCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.outlineVariant,
                    },
                  ]}
                  mode="outlined"
                >
                  <Card.Content>
                    <Chip
                      compact
                      style={[styles.partChip, { backgroundColor: theme.colors.secondaryContainer }]}
                      textStyle={{ color: theme.colors.onSecondaryContainer, fontWeight: "700" }}
                    >
                      {meaning.partOfSpeech}
                    </Chip>

                    {meaning.definitions.map((definition, index) => (
                      <View key={`${definition.definition}-${index}`} style={styles.definitionBlock}>
                        <Text
                          variant="bodyLarge"
                          style={[styles.definitionText, { color: theme.colors.onSurface }]}
                        >
                          {index + 1}. {definition.definition}
                        </Text>
                        {definition.example ? (
                          <Text
                            variant="bodyMedium"
                            style={[styles.example, { color: theme.colors.onSurfaceVariant }]}
                          >
                            "{definition.example}"
                          </Text>
                        ) : null}
                      </View>
                    ))}
                  </Card.Content>
                </Card>
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  heroImage: {
    height: 190,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 14,
    justifyContent: "flex-end",
  },
  heroImageInner: { borderRadius: 8 },
  heroOverlay: {
    padding: 18,
    backgroundColor: "rgba(5, 31, 32, 0.78)",
  },
  heroTitle: { color: "#FFFFFF", fontWeight: "900" },
  heroSubtitle: { color: "#F8FFFE", marginTop: 4, maxWidth: 320, lineHeight: 22 },
  searchPanel: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  title: { fontWeight: "800", marginBottom: 4 },
  searchbar: { marginTop: 16, borderRadius: 8, elevation: 0 },
  searchInput: { fontSize: 16 },
  searchButton: { borderRadius: 8, marginTop: 12 },
  searchButtonContent: { minHeight: 48 },
  suggestions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  suggestionChip: { borderRadius: 8 },
  results: { marginTop: 16 },
  wordHeader: {
    borderRadius: 8,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  wordTextWrap: { flex: 1 },
  word: { fontWeight: "900", textTransform: "capitalize" },
  phoneticRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 4,
  },
  playButton: {
    marginLeft: -6,
  },
  playButtonContent: {
    minHeight: 34,
  },
  audioControls: { alignItems: "center" },
  stopButton: {
    marginRight: -6,
  },
  audioVariants: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  audioVariantRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  audioVariantChip: { borderRadius: 8 },
  meaningCard: { borderRadius: 8, marginBottom: 12 },
  partChip: { alignSelf: "flex-start", borderRadius: 8, marginBottom: 12 },
  definitionBlock: { paddingVertical: 10 },
  definitionText: { lineHeight: 24 },
  example: { marginTop: 6, fontStyle: "italic", lineHeight: 22 },
});

export default ItemListScreen;
