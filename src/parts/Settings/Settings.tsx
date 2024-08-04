import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Settings.module.scss";
const mc = mapClassesCurried(maps, true);

import Toggle from "../../interface/Toggle";
import { useContext } from "react";
import { SettingsContext } from "../../hooks/useSettings";

export default function Settings() {
  const { theme, forceScale, toggleTheme, toggleForceScale } = useContext(SettingsContext);

  const classList = useClassList({ defaultClass: "settings", maps, string: true });

  return (
    <div className={classList}>
      <Toggle checked={theme === "dark"} onChange={() => toggleTheme()}>
        Dark Mode
      </Toggle>

      <Toggle checked={forceScale} onChange={() => toggleForceScale()}>
        Force Increased Text Scale
      </Toggle>

      <p className={mc('settings__version')}>Version: {__APP_VERSION__}</p>
    </div>
  );
}
