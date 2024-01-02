import { useContext, useEffect } from "react";
import Toggle from "../../interface/Toggle";
import { SettingsContext } from "../../hooks/useSettings";
import { ThemeContext } from "../ThemeWrapper/ThemeWrapper";
import { vibrate } from "../../helpers/vibrate";

export default function ThemeToggle({ className }) {
  const { settings, toggleTheme, toggleSystemTheme, useVibration } = useContext(SettingsContext);
  const { toggleTheme: TT } = useContext(ThemeContext);

  // toggle theme in real-time
  useEffect(() => {
    TT(settings.theme);
  }, [settings]);

  return (
    <>
      <Toggle
        className={className}
        checked={settings.sysTheme}
        onChange={() => useVibration(() => toggleSystemTheme())}
      >
        Use System Theme
      </Toggle>
      <Toggle
        className={className}
        checked={settings.theme === "dark"}
        disabled={settings.sysTheme}
        onChange={() => useVibration(() => toggleTheme())}
      >
        Dark Theme
      </Toggle>
    </>
  );
}
