import { createContext, useCallback, useMemo, useState } from "react";

// theme
import { generateCSSVariables, theme, elementsLight, elementsDark } from "../../interface/index";

// helpers
import { setCookie } from "../../helpers/cookie";

// types
import type { ReactNode } from "react";

interface IThemeWrapper {
  children: ReactNode[] | ReactNode;
  value: string;
}

interface ITheme {
  themeState: string;
  toggleTheme: () => void;
}

function useTheme(value: string) {
  const [theme, setTheme] = useState(value);

  const toggleTheme = useCallback((_theme: string) => {
    setTheme(t => {
      const update = _theme ? _theme : t === "light" ? "dark" : "light";

      // update the meta theme color
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", update === "dark" ? "#181818" : "#ffffff");

      if (localStorage) setCookie("theme", update, 10000);

      return update;
    });
  }, []);

  return useMemo(() => ({ themeState: theme, toggleTheme }), [theme, toggleTheme]);
}

export const ThemeContext = createContext<ITheme | any>(null);

export default function ThemeWrapper({ children, value }: IThemeWrapper) {
  const _theme = useTheme(value);

  const themeStyles = generateCSSVariables(theme);
  const elementsTheme = generateCSSVariables(_theme.themeState === "light" ? elementsLight : elementsDark);

  return (
    <ThemeContext.Provider value={_theme}>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <style dangerouslySetInnerHTML={{ __html: elementsTheme }} />

      {children}
    </ThemeContext.Provider>
  );
}
