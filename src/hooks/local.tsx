import { useCallback } from "react";

export function useLocalStorage<T>(key: string): {
  data: T | "" | null;
  setItem: (value: string) => void;
  removeItem: () => void;
} {
  const existing = localStorage.getItem(key) || null;

  return {
    data: existing && (JSON.parse(existing) as unknown as T),
    setItem: useCallback(
      (value: string) => localStorage.setItem(key, JSON.stringify(value)),
      [key]
    ),
    removeItem: useCallback(() => localStorage.removeItem(key), [key]),
  };
}
