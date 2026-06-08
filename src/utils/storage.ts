import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  THEME: "@app_theme",
  SEARCH_HISTORY: "@lexidict_search_history",
  ONBOARDING_SEEN: "@lexidict_onboarding_seen",
};

export const saveThemePreference = (mode: "light" | "dark") =>
  AsyncStorage.setItem(KEYS.THEME, mode);

export const getThemePreference = () =>
  AsyncStorage.getItem(KEYS.THEME) as Promise<"light" | "dark" | null>;

export const getSearchHistory = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(KEYS.SEARCH_HISTORY);
  return raw ? JSON.parse(raw) : [];
};

export const saveSearchHistory = async (words: string[]) => {
  await AsyncStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(words));
};

export const addSearchHistoryWord = async (word: string) => {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return [];

  const history = await getSearchHistory();
  const next = [normalized, ...history.filter((item) => item !== normalized)].slice(0, 30);
  await saveSearchHistory(next);
  return next;
};

export const clearSearchHistory = () =>
  AsyncStorage.removeItem(KEYS.SEARCH_HISTORY);

export const clearThemePreference = () => AsyncStorage.removeItem(KEYS.THEME);

export const getOnboardingSeen = () => AsyncStorage.getItem(KEYS.ONBOARDING_SEEN);

export const setOnboardingSeen = () =>
  AsyncStorage.setItem(KEYS.ONBOARDING_SEEN, "true");

export const removeSearchHistoryWord = async (word: string) => {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return [];

  const history = await getSearchHistory();
  const next = history.filter((item) => item !== normalized);
  await saveSearchHistory(next);
  return next;
};
