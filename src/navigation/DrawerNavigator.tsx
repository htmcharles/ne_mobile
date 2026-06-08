import React from "react";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { Divider, IconButton, List, Text } from "react-native-paper";
import { useAppTheme } from "../contexts/ThemeContext";
import { appConfig } from "../config/appConfig";
import { useDictionary } from "../contexts/DictionaryContext";
import ConfirmDialog from "../components/ConfirmDialog";

import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const HistoryDrawerContent = (props: any) => {
  const { theme } = useAppTheme();
  const { history, searchWord, clearHistory } = useDictionary();
  const [confirmVisible, setConfirmVisible] = React.useState(false);

  const openWord = async (word: string) => {
    props.navigation.navigate("HomeTabs", {
      screen: "Dictionary",
      params: { word },
    });
    await searchWord(word);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.brand}>
        <MaterialCommunityIcons name="book-open-page-variant-outline" size={34} color={theme.colors.primary} />
        <View style={styles.brandText}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: "800" }}>
            {appConfig.appName}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            English dictionary
          </Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.historyHeader}>
        <Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "700" }}>
          Search history
        </Text>
        {history.length > 0 ? (
          <IconButton icon="delete-outline" size={18} onPress={() => setConfirmVisible(true)} />
        ) : null}
      </View>

      {history.length === 0 ? (
        <Text variant="bodyMedium" style={[styles.emptyHistory, { color: theme.colors.onSurfaceVariant }]}>
          Your searched words will appear here.
        </Text>
      ) : (
        history.map((word) => (
          <List.Item
            key={word}
            title={word}
            titleStyle={{ textTransform: "capitalize", color: theme.colors.onSurface }}
            left={(itemProps) => <List.Icon {...itemProps} icon="history" />}
            right={(itemProps) => (
              <View style={styles.drawerItemActions}>
                <List.Icon {...itemProps} icon="chevron-right" />
              </View>
            )}
            onPress={() => openWord(word)}
            style={styles.historyItem}
          />
        ))
      )}

      <ConfirmDialog
        visible={confirmVisible}
        title="Clear history?"
        message="This will remove every saved word from the drawer history."
        confirmLabel="Clear"
        cancelLabel="Keep"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={async () => {
          await clearHistory();
          setConfirmVisible(false);
        }}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const { theme } = useAppTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <HistoryDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: theme.colors.surface, width: 280 },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerLabelStyle: { fontSize: 15, fontWeight: "500", marginLeft: -16 },
        drawerItemStyle: { borderRadius: 12, marginHorizontal: 8 },
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{
          title: appConfig.appName,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-search-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  drawerContent: { paddingBottom: 24 },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  brandText: { marginLeft: 12, flex: 1 },
  divider: { marginVertical: 8 },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 8,
  },
  emptyHistory: { paddingHorizontal: 20, paddingTop: 12 },
  historyItem: { paddingHorizontal: 8 },
  drawerItemActions: { flexDirection: "row", alignItems: "center" },
});
