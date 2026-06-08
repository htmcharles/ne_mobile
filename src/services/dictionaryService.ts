import axios, { AxiosError } from "axios";
import { appConfig } from "../config/appConfig";
import { DictionaryEntry } from "../types";

const dictionaryApi = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

export const normalizeAudioUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("//")) return `https:${url}`;
  return url;
};

export const findAudioUrl = (entry?: DictionaryEntry | null) => {
  const audio = entry?.phonetics?.find((phonetic) => phonetic.audio?.trim())?.audio;
  return normalizeAudioUrl(audio);
};

export const getAudioOptions = (entry?: DictionaryEntry | null) => {
  const seen = new Set<string>();

  return (
    entry?.phonetics
      ?.map((phonetic, index) => ({
        label: phonetic.text || `Audio ${index + 1}`,
        url: normalizeAudioUrl(phonetic.audio),
      }))
      .filter((option) => {
        if (!option.url || seen.has(option.url)) return false;
        seen.add(option.url);
        return true;
      }) ?? []
  );
};

export const findPhoneticText = (entry?: DictionaryEntry | null) => {
  return (
    entry?.phonetic ||
    entry?.phonetics?.find((phonetic) => phonetic.text?.trim())?.text ||
    ""
  );
};

export const validateSearchWord = (word: string) => {
  const trimmed = word.trim();
  if (!trimmed) {
    return "Please enter a word to search.";
  }

  if (/\s/.test(trimmed)) {
    return "Please search for one word, not a sentence.";
  }

  if (/\d/.test(trimmed)) {
    return "Please search for a word instead of numbers.";
  }

  if (!/^[a-zA-Z]+$/.test(trimmed)) {
    return "Please search for a word instead of numbers.";
  }

  return "";
};

export const fetchWordDefinitions = async (word: string): Promise<DictionaryEntry[]> => {
  const normalized = word.trim().toLowerCase();
  if (!normalized) {
    throw new Error("Enter a word to search.");
  }

  try {
    const response = await dictionaryApi.get<DictionaryEntry[]>(
      `/${encodeURIComponent(normalized)}`,
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    const axiosError = error as AxiosError<{ title?: string; message?: string }>;

    if (axiosError.response?.status === 404) {
      throw new Error("Word not found. Check the spelling and try again.");
    }

    if (axiosError.code === "ECONNABORTED") {
      throw new Error("The dictionary took too long to respond. Please try again.");
    }

    if (!axiosError.response) {
      throw new Error("Network error. Check your connection and try again.");
    }

    throw new Error(
      axiosError.response.data?.message ||
        "Could not load the definition right now. Please try again.",
    );
  }
};
