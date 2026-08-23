import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ReadingSize = "small" | "standard" | "large" | "xlarge";
const READING_KEY = "sakinah-reading-settings.v1";
const scales: Record<ReadingSize, number> = { small: 0.88, standard: 1, large: 1.16, xlarge: 1.32 };

type ReadingSettingsValue = { size: ReadingSize; scale: number; setSize: (size: ReadingSize) => void };
const ReadingSettingsContext = createContext<ReadingSettingsValue | null>(null);

export function ReadingSettingsProvider({ children }: { children: React.ReactNode }) {
  const [size, setSizeState] = useState<ReadingSize>("standard");
  useEffect(() => { AsyncStorage.getItem(READING_KEY).then((stored) => { if (stored && stored in scales) setSizeState(stored as ReadingSize); }).catch(() => undefined); }, []);
  const setSize = useCallback((next: ReadingSize) => { setSizeState(next); AsyncStorage.setItem(READING_KEY, next).catch(() => undefined); }, []);
  const value = useMemo(() => ({ size, scale: scales[size], setSize }), [size, setSize]);
  return <ReadingSettingsContext.Provider value={value}>{children}</ReadingSettingsContext.Provider>;
}

export function useReadingSettings() {
  const context = useContext(ReadingSettingsContext);
  if (!context) throw new Error("useReadingSettings must be used within ReadingSettingsProvider");
  return context;
}
