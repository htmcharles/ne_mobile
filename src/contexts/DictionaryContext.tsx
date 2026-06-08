import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DictionaryEntry } from "../types";
import { fetchWordDefinitions } from "../services/dictionaryService";
import {
  addSearchHistoryWord,
  clearSearchHistory,
  getSearchHistory,
  removeSearchHistoryWord,
} from "../utils/storage";

interface DictionaryState {
  entries: DictionaryEntry[];
  history: string[];
  currentWord: string;
  isLoading: boolean;
  error: string;
  searchWord: (word: string) => Promise<void>;
  reloadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  removeHistoryItem: (word: string) => Promise<void>;
}

const DictionaryContext = createContext<DictionaryState>({} as DictionaryState);

export const DictionaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const reloadHistory = useCallback(async () => {
    setHistory(await getSearchHistory());
  }, []);

  useEffect(() => {
    reloadHistory();
  }, [reloadHistory]);

  const searchWord = useCallback(async (word: string) => {
    const normalized = word.trim().toLowerCase();
    if (!normalized) {
      setError("Enter a word to search.");
      setEntries([]);
      return;
    }

    setIsLoading(true);
    setError("");
    setCurrentWord(normalized);

    try {
      const result = await fetchWordDefinitions(normalized);
      setEntries(result);
      setHistory(await addSearchHistoryWord(normalized));
    } catch (err: any) {
      setEntries([]);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    await clearSearchHistory();
    setHistory([]);
  }, []);

  const removeHistoryItem = useCallback(async (word: string) => {
    setHistory(await removeSearchHistoryWord(word));
  }, []);

  const value = useMemo(
    () => ({
      entries,
      history,
      currentWord,
      isLoading,
      error,
      searchWord,
      reloadHistory,
      clearHistory,
      removeHistoryItem,
    }),
    [
      entries,
      history,
      currentWord,
      isLoading,
      error,
      searchWord,
      reloadHistory,
      clearHistory,
      removeHistoryItem,
    ],
  );

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionary = () => {
  const ctx = useContext(DictionaryContext);
  if (!ctx) throw new Error("useDictionary must be used within DictionaryProvider");
  return ctx;
};
