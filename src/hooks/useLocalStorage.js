import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage — drop-in replacement for useState that persists to localStorage.
 * @param {string} key - unique storage key (namespaced with 'devtoolkit_')
 * @param {*} defaultValue - initial value when nothing is stored yet
 */
export function useLocalStorage(key, defaultValue) {
  const storageKey = `devtoolkit_${key}`;

  const readValue = useCallback(() => {
    try {
      const item = localStorage.getItem(storageKey);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }, [storageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback((value) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      localStorage.setItem(storageKey, JSON.stringify(newValue));
    } catch {
      // ignore write errors (e.g. private browsing quota)
    }
  }, [storageKey, storedValue]);

  // Keep in sync if another tab changes the key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === storageKey) setStoredValue(readValue());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [storageKey, readValue]);

  return [storedValue, setValue];
}
