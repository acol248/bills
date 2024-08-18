import { createContext, useCallback, useLayoutEffect, useMemo, useState } from "react";

// types
import useLocalStorage from "@blocdigital/uselocalstorage";

type Settings = {
  theme: "light" | "dark";
  scale: number;
  forceScale: boolean;
};

interface UseSettings {
  theme: "light" | "dark";
  forceScale: boolean;
  scale: number;
  toggleTheme: (theme?: "light" | "dark") => void;
  toggleForceScale: (state?: boolean) => void;
  updateScale: (scale: number) => void;
}

export default function useSettings(): UseSettings {
  const storage = useLocalStorage("local");

  const [data, setData] = useState<Settings>({ theme: "light", scale: 1.25, forceScale: false });

  const toggleTheme = useCallback<UseSettings["toggleTheme"]>(theme => {
    setData(d => {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "dark" || d.theme === "light" ? "#202020" : "#fbf7f5");

      storage.set("settings", { ...d, theme: theme ? theme : d.theme === "light" ? "dark" : "light" });

      return { ...d, theme: theme ? theme : d.theme === "light" ? "dark" : "light" };
    });
  }, []);

  const toggleForceScale = useCallback<UseSettings["toggleForceScale"]>(state => {
    setData(d => {
      document.body.style.setProperty("--core-scale", state ?? !d.forceScale ? d.scale.toString() : "1");

      storage.set("settings", { ...d, forceScale: state ?? !d.forceScale });

      return { ...d, forceScale: state ?? !d.forceScale };
    });
  }, []);

  const updateScale = useCallback<UseSettings["updateScale"]>(scale => {
    setData(d => ({ ...d, scale }));
  }, []);

  // adjust scale style
  useLayoutEffect(() => {
    document.body.style.setProperty("--core-scale", data.forceScale ? data.scale.toString() : "1");
  }, [data.forceScale, data.scale]);

  // get theme cookie value
  useLayoutEffect(() => {
    if (!storage) return;

    const _data = storage.get<Settings>("settings");

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", (_data ?? { theme: "light" }).theme === "dark" ? "#202020" : "#fbf7f5");

    if (_data) setData(_data);
  }, [storage]);

  return useMemo(
    () => ({
      theme: data.theme,
      forceScale: data.forceScale,
      scale: data.scale,
      toggleTheme,
      toggleForceScale,
      updateScale,
    }),
    [data.theme, data.forceScale, data.scale, toggleTheme, toggleForceScale]
  );
}

export const SettingsContext = createContext<UseSettings>({
  theme: "light",
  forceScale: true,
  scale: 1,
  toggleTheme: () => {},
  toggleForceScale: () => {},
  updateScale: () => {},
});
