import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// helpers
import { decodeBase64, encodeBase64 } from "../../helpers/encodeBase64";

export default function useSettings() {
  const initialised = useRef(false);
  const _storage = localStorage.getItem("settings");

  const [settings, setSettings] = useState(_storage ? decodeBase64(_storage) : {});

  /**
   * Handle toggle theme between light and dark
   */
  const toggleTheme = useCallback(() => {
    setSettings(s => {
      return { ...s, theme: s.theme === "light" ? "dark" : "light" };
    });
  }, []);

  // update localstorage
  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;

      return;
    }

    localStorage.setItem("settings", encodeBase64(settings));
  }, [settings]);

  return useMemo(() => ({ settings, toggleTheme }), [settings, toggleTheme]);
}

export const SettingsContext = createContext(null);
