import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Settings.module.scss";
const mc = mapClassesCurried(maps, true);

import Toggle from "../../interface/Toggle";
import { useContext } from "react";
import { SettingsContext } from "../../hooks/useSettings";
import Slider from "../../components/Slider";

export default function Settings() {
  const { theme, forceScale, toggleTheme, toggleForceScale, updateScale } = useContext(SettingsContext);

  const classList = useClassList({ defaultClass: "settings", maps, string: true });

  return (
    <div className={classList}>
      <Toggle checked={theme === "dark"} onChange={() => toggleTheme()}>
        Dark Mode
      </Toggle>

      <Toggle checked={forceScale} onChange={() => toggleForceScale()}>
        Force Increased Text Scale
      </Toggle>

      {forceScale && (
        <Slider
          className={mc("settings__scale")}
          step={0.2}
          max={1.4}
          min={0.6}
          defaultValue={[1]}
          onValueChange={([s]) => updateScale(s)}
        />
      )}

      <p className={mc("settings__version")}>Version: {__APP_VERSION__}</p>
    </div>
  );
}
