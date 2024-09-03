import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Slider from "../../components/Slider";
import Toggle from "../../interface/Toggle";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Settings.module.scss";
const mc = mapClassesCurried(maps, true);

export default function Settings() {
  const { theme, pst, scale, forceScale, authCheck, toggleTheme, togglePST, toggleForceScale, updateScale } =
    useContext(SettingsContext);

  const navigate = useNavigate();

  const classList = useClassList({ defaultClass: "settings", maps, string: true });

  return (
    <div className={classList}>
      <div className={mc("settings__section")}>
        <h3>Appearance</h3>

        <Toggle checked={theme === "dark"} disabled={pst} onChange={() => toggleTheme()}>
          Dark Mode
        </Toggle>

        <Toggle checked={pst} onChange={() => togglePST()}>
          Prefer System Theme
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
            defaultValue={[scale]}
            onValueChange={([s]) => updateScale(s)}
          />
        )}
      </div>

      <div className={mc("settings__section")}>
        <h3>Security</h3>

        <button onClick={() => navigate("/settings/manage-pin")}>{authCheck ? "Change Pin" : "Create Pin"}</button>
        {authCheck && <button onClick={() => navigate("/settings/remove-pin")}>Remove</button>}
      </div>

      <p className={mc("settings__version")}>Version: {__APP_VERSION__}</p>
    </div>
  );
}
