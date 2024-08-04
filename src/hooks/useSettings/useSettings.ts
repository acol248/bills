import { createContext, useCallback, useLayoutEffect, useState } from "react";
import { getCookie, setCookie } from "../../helpers/cookie";

// types
import type { Dispatch, SetStateAction } from "react";

interface UseSettings {
  theme: "light" | "dark";
  forceScale: boolean;
  scale: number;
  toggleTheme: (theme?: "light" | "dark") => void;
  toggleForceScale: (state?: boolean) => void;
  setScale: Dispatch<SetStateAction<number>>;
}

export default function useSettings(): UseSettings {
  const [theme, setTheme] = useState<UseSettings["theme"]>("light");

  const [forceScale, setForceScale] = useState<UseSettings["forceScale"]>(false);
  const [scale, setScale] = useState<UseSettings["scale"]>(1.25);

  const toggleTheme = useCallback<UseSettings["toggleTheme"]>(theme => {
    setTheme(t => {
      setCookie("theme", theme ? theme : t === "light" ? "dark" : "light", 30);

      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "dark" || t === "light" ? "#202020" : "#fbf7f5");

      return theme ? theme : t === "light" ? "dark" : "light";
    });
  }, []);

  const toggleForceScale = useCallback<UseSettings["toggleForceScale"]>(
    state => {
      setForceScale(s => {
        document.body.style.setProperty("--core-scale", scale ?? !s ? scale.toString() : "1");

        return state ?? !s;
      });
    },
    [scale]
  );

  // adjust scale style
  useLayoutEffect(() => {
    document.body.style.setProperty("--core-scale", forceScale ? scale.toString() : "1");
  }, [forceScale, scale]);

  // get theme cookie value
  useLayoutEffect(() => {
    const theme = getCookie("theme");

    setTheme(theme as SetStateAction<"light" | "dark">);

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#202020" : "#fbf7f5");
  }, []);

  return {
    theme,
    forceScale,
    scale,
    toggleTheme,
    toggleForceScale,
    setScale,
  };
}

export const SettingsContext = createContext<UseSettings>({
  theme: "light",
  forceScale: true,
  scale: 1,
  toggleTheme: () => {},
  toggleForceScale: () => {},
  setScale: () => {},
});
