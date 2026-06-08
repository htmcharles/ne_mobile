import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Button, IconButton, List, Surface, Text } from "react-native-paper";
import { useAppTheme } from "../../contexts/ThemeContext";
import { useDictionary } from "../../contexts/DictionaryContext";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";

const HistoryScreen = ({ navigation }: any) => {
  const { theme } = useAppTheme();
  const {
    history,
    isLoading,
    searchWord,
    reloadHistory,
    clearHistory,
    removeHistoryItem,
  } = useDictionary();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", reloadHistory);
    return unsubscribe;
  }, [navigation, reloadHistory]);

  const openWord = async (word: string) => {
    await searchWord(word);
    navigation.navigate("Dictionary", { word });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={0}>
        <View style={styles.headerText}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: "800" }}>
            Search history
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Tap a word to look it up again.
          </Text>
        </View>
        {history.length > 0 ? (
          <IconButton icon="delete-outline" size={22} onPress={() => setConfirmVisible(true)} />
        ) : null}
      </Surface>

      <FlatList
        data={history}
        keyExtractor={(item) => item}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={reloadHistory} />
        }
        contentContainerStyle={history.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="history"
            title="No search history"
            subtitle="Successful word searches will be saved here."
            actionLabel="Search a word"
            onAction={() => navigation.navigate("Dictionary")}
          />
        }
        renderItem={({ item }) => (
          <Surface style={[styles.item, { backgroundColor: theme.colors.surface }]} elevation={0}>
            <List.Item
              title={item}
              description="Open definition"
              titleStyle={{ textTransform: "capitalize", color: theme.colors.onSurface, fontWeight: "700" }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              left={(props) => <List.Icon {...props} icon="book-open-page-variant-outline" />}
              right={() => (
                <View style={styles.itemActions}>
                  <Button mode="text" icon="magnify" onPress={() => openWord(item)}>
                    Search
                  </Button>
                  <IconButton
                    icon="close-circle-outline"
                    size={18}
                    onPress={() => setDeleteTarget(item)}
                  />
                </View>
              )}
              onPress={() => openWord(item)}
            />
          </Surface>
        )}
      />

      <ConfirmDialog
        visible={confirmVisible}
        title="Clear search history?"
        message="This will remove every saved word from the drawer and history screen."
        confirmLabel="Clear"
        cancelLabel="Keep"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={async () => {
          await clearHistory();
          setConfirmVisible(false);
        }}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Remove word?"
        message={`Remove "${deleteTarget ?? ""}" from your history?`}
        confirmLabel="Remove"
        cancelLabel="Keep"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await removeHistoryItem(deleteTarget);
          }
          setDeleteTarget(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: { flex: 1 },
  list: { padding: 16, paddingTop: 0 },
  emptyList: { flexGrow: 1 },
  item: {
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HistoryScreen;
