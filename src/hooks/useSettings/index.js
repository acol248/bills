import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

// helpers
import { decodeBase64, encodeBase64 } from "../../helpers/encodeBase64";

export default function useSettings() {
  const initialised = useRef(false);
  const _initSysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const _storage = localStorage.getItem("settings");

  const [settings, setSettings] = useState(
    _storage ? decodeBase64(_storage) : { scale: 1, sysTheme: true, theme: _initSysTheme ? "dark" : "light" }
  );

  /**
   * Handle toggle theme between light and dark
   */
  const toggleTheme = useCallback(() => {
    setSettings(s => ({ ...s, theme: s.theme === "light" ? "dark" : "light" }));
  }, []);

  /**
   * Handle toggle setting to prefer use of system theme
   */
  const toggleSystemTheme = useCallback(() => {
    const getSysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setSettings(s => ({ ...s, theme: getSysTheme ? "dark" : "light", sysTheme: s.sysTheme ? false : true }));
  }, []);

  /**
   * Handle toggle app vibrations on/off
   */
  const toggleVibration = useCallback(() => {
    setSettings(s => {
      return { ...s, vibration: s.vibration ? false : true };
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
  const useVibration = useCallback(
    params => {
      const { callback = () => {}, time = 8 } = params || {};

      if (!settings.vibration) return callback();

      navigator.vibrate(time);

      return callback();
    },
    [settings]
  );

  // update localstorage
  useEffect(() => {
    if (!initialised.current) {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute(
          "content",
          settings.sysTheme
            ? _initSysTheme
              ? "#202020"
              : "#fbf7f5"
            : settings.theme === "dark"
              ? "#202020"
              : "#fbf7f5"
        );

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
    () => ({ settings, toggleTheme, toggleSystemTheme, toggleVibration, setScale, useVibration }),
    [settings, toggleTheme, toggleSystemTheme, toggleVibration, setScale, useVibration]
  );
}

export const SettingsContext = createContext(null);
