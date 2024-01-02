import { useCallback, useContext, useState } from "react";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Icon from "./ScaleSelect.icons";

// styles
import maps from "./ScaleSelect.module.scss";

const mc = mapClassesCurried(maps, true);

export default function ScaleSelect({ className }) {
  const { settings, setScale, useVibration } = useContext(SettingsContext);

  const classList = useClassList(
    { defaultClass: "scale-select", className, maps, string: true },
    useCallback(
      c => c.push(`scale-select--${settings.scale < 1 ? "small" : settings.scale > 1 ? "large" : "medium"}`),
      [settings]
    )
  );

  /**
   * Increase scale by 0.1, up to 1.3
   */
  const handleIncreaseScale = () => setScale(settings.scale < 1.3 ? settings.scale + 0.1 : 1.3);

  /**
   * Reduce scale by 0.1, up to 0.7
   */
  const handleReduceScale = () => setScale(settings.scale > 0.7 ? settings.scale - 0.1 : 0.7);

  return (
    <div className={classList}>
      <span>Display Scale</span>

      <div className={mc("scale-select__scaler")}>
        <button className={mc("scale-select__button")} aria-label="Reduce display scale" onClick={handleReduceScale}>
          <Icon type="minus" />
        </button>
        <input
          type="range"
          onChange={({ target }) => useVibration(() => setScale(parseFloat(target.value)))}
          step="0.1"
          min="0.7"
          max="1.3"
          value={settings.scale}
        />
        <button
          className={mc("scale-select__button")}
          aria-label="Increase display scale"
          onClick={handleIncreaseScale}
        >
          <Icon type="plus" />
        </button>
      </div>
    </div>
  );
}
