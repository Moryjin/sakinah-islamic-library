import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type SakinahStoreValue = {
  favoriteIds: string[];
  lastOpenedId: string | null;
  hydrated: boolean;
  toggleFavorite: (id: string) => void;
  markOpened: (id: string) => void;
};

const SakinahStore = createContext<SakinahStoreValue | null>(null);
const FAVORITES_KEY = "sakinah-favorites";
const LAST_OPENED_KEY = "sakinah-last-opened";

export function SakinahStoreProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [lastOpenedId, setLastOpenedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([AsyncStorage.getItem(FAVORITES_KEY), AsyncStorage.getItem(LAST_OPENED_KEY)])
      .then(([savedFavorites, savedLastOpened]) => {
        if (!active) return;
        setFavoriteIds(savedFavorites ? JSON.parse(savedFavorites) : []);
        setLastOpenedId(savedLastOpened);
      })
      .catch(() => undefined)
      .finally(() => active && setHydrated(true));
    return () => {
      active = false;
    };
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const markOpened = useCallback((id: string) => {
    setLastOpenedId(id);
    AsyncStorage.setItem(LAST_OPENED_KEY, id).catch(() => undefined);
  }, []);

  const value = useMemo(
    () => ({ favoriteIds, lastOpenedId, hydrated, toggleFavorite, markOpened }),
    [favoriteIds, lastOpenedId, hydrated, toggleFavorite, markOpened],
  );

  return <SakinahStore.Provider value={value}>{children}</SakinahStore.Provider>;
}

export function useSakinahStore() {
  const value = useContext(SakinahStore);
  if (!value) throw new Error("useSakinahStore must be used within SakinahStoreProvider");
  return value;
}
