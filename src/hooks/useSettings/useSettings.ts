import {
  SetStateAction,
  createContext,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { getCookie, setCookie } from "../../helpers/cookie";

// types
interface UseSettings {
  theme: "light" | "dark";
  toggleTheme: (theme?: "light" | "dark") => void;
}

export default function useSettings(): UseSettings {
  const [theme, setTheme] = useState<UseSettings["theme"]>("light");

  const toggleTheme = useCallback<UseSettings["toggleTheme"]>((theme) => {
    setTheme((t) => {
      setCookie("theme", theme ? theme : t === "light" ? "dark" : "light", 30);

      return theme ? theme : t === "light" ? "dark" : "light";
    });
  }, []);

  // get theme cookie value
  useLayoutEffect(() => {
    const theme = getCookie("theme");

    setTheme(theme as SetStateAction<"light" | "dark">);
  }, []);

  return {
    theme,
    toggleTheme,
  };
}

export const SettingsContext = createContext<UseSettings>({
  theme: "light",
  toggleTheme: () => {},
});
