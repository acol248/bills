import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  const {
    theme,
    vibrations,
    pst,
    scale,
    forceScale,
    authCheck,
    toggleTheme,
    togglePST,
    toggleForceScale,
    updateScale,
    toggleVibrations,
    vibrate,
  } = useContext(SettingsContext);

  const navigate = useNavigate();

  const classList = useClassList({ defaultClass: "settings", maps, string: true });

  return (
    <motion.div
      className={classList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.125, ease: "easeInOut" }}
    >
      <h1>Settings</h1>

      <div className={mc("settings__section")}>
        <h3>Appearance</h3>

        <Toggle
          className={mc("settings__toggle")}
          checked={theme === "dark"}
          disabled={pst}
          onChange={() => vibrate({ callback: () => toggleTheme() })}
        >
          Dark Mode
        </Toggle>

        <Toggle
          className={mc("settings__toggle")}
          checked={pst}
          onChange={() => vibrate({ callback: () => togglePST() })}
        >
          Prefer System Theme
        </Toggle>
      </div>

      <div className={mc("settings__section")}>
        <h3>Accessibility</h3>

        <Toggle
          className={mc("settings__toggle")}
          checked={vibrations}
          onChange={() => vibrate({ callback: () => toggleVibrations() })}
        >
          Use Vibrations
        </Toggle>

        <div className={mc("settings__fake-item")}>
          <Toggle
            className={mc("settings__toggle")}
            checked={forceScale}
            onChange={() => vibrate({ callback: () => toggleForceScale() })}
          >
            Force Increased Text Scale
          </Toggle>

          {forceScale && (
            <Slider
              className={mc("settings__scale")}
              step={0.2}
              max={1.4}
              min={0.6}
              defaultValue={[scale]}
              onValueChange={([s]) => vibrate({ callback: () => updateScale(s) })}
            />
          )}
        </div>
      </div>

      <div className={mc("settings__section")}>
        <h3>Security</h3>

        <button onClick={() => vibrate({ callback: () => navigate("/settings/manage-pin") })}>
          {authCheck ? "Change Pin" : "Create Pin"}
        </button>
        {authCheck && (
          <button onClick={() => vibrate({ callback: () => navigate("/settings/remove-pin") })}>Remove</button>
        )}
      </div>
    </motion.div>
  );
}
