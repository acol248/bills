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

  /**
   * Handle toggle app vibrations on/off
   */
  const toggleVibration = useCallback(() => {
    setSettings(s => {
      return { ...s, vibration: s.vibration === "true" ? "false" : "true" };
    });
  }, []);

  /**
   * Handle toggle app scale
   */
  const setScale = useCallback(scale => {
    setSettings(s => {
      return { ...s, scale };
    });
  }, []);

  /**
   * Use system vibration
   */
  const useVibration = useCallback((time = 20, callback = () => {}) => {
    if (settings.vibration !== "true") return;

    navigator.vibrate(time);

    return callback && callback();
  }, []);

  // update localstorage
  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;

      return;
    }

    localStorage.setItem("settings", encodeBase64(settings));
  }, [settings]);

  // update scale in styles
  useEffect(() => {
    const { scale } = settings || decodeBase64(_storage);

    if (!scale) return;

    const root = document.getElementById("root");
    root.style.setProperty("--core-scale", scale);
  }, [settings]);

  return useMemo(
    () => ({ settings, toggleTheme, toggleVibration, setScale, useVibration }),
    [settings, toggleTheme, toggleVibration, setScale, useVibration]
  );
}

export const SettingsContext = createContext(null);
