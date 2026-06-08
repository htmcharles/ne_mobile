import React, { useMemo, useState } from "react";
import { useWindowDimensions, View, StyleSheet } from "react-native";
import { Button, Dialog, IconButton, Portal, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../contexts/ThemeContext";

type Slide = {
  icon: string;
  title: string;
  body: string;
};

interface Props {
  visible: boolean;
  onDone: () => void;
}

const slides: Slide[] = [
  {
    icon: "book-open-page-variant-outline",
    title: "Search any word",
    body: "Type an English word and tap Search to fetch definitions, examples, and pronunciations.",
  },
  {
    icon: "volume-high",
    title: "Use pronunciation",
    body: "When audio is available, tap the speaker button near the phonetic line to play it.",
  },
  {
    icon: "history",
    title: "Go back fast",
    body: "Your successful searches are saved in History and the drawer for quick reopening.",
  },
];

const OnboardingModal: React.FC<Props> = ({ visible, onDone }) => {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const slide = useMemo(() => slides[index], [index]);

  const next = () => {
    if (index < slides.length - 1) {
      setIndex((value) => value + 1);
      return;
    }
    onDone();
    setIndex(0);
  };

  const skip = () => {
    onDone();
    setIndex(0);
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={skip}
        style={[styles.dialog, { width: Math.min(width - 32, 420), alignSelf: "center" }]}
      >
        <Dialog.Content>
          <View style={styles.topRow}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: "800" }}>
              Welcome to LexiDict
            </Text>
            <IconButton icon="close" size={20} onPress={skip} />
          </View>

          <View style={[styles.iconWrap, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name={slide.icon as any} size={42} color={theme.colors.onPrimaryContainer} />
          </View>

          <Text variant="headlineSmall" style={[styles.slideTitle, { color: theme.colors.onSurface }]}>
            {slide.title}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, lineHeight: 22 }}>
            {slide.body}
          </Text>

          <View style={styles.dots}>
            {slides.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      dotIndex === index ? theme.colors.primary : theme.colors.outlineVariant,
                  },
                ]}
              />
            ))}
          </View>
        </Dialog.Content>

        <Dialog.Actions style={styles.actions}>
          <Button onPress={skip}>Skip</Button>
          <Button mode="contained" onPress={next}>
            {index === slides.length - 1 ? "Get started" : "Next"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
    maxWidth: 420,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    marginBottom: 18,
    alignSelf: "center",
  },
  slideTitle: { fontWeight: "800", textAlign: "center", marginBottom: 8 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});

export default OnboardingModal;
