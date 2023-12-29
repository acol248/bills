import { useCallback, useContext } from "react";
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

  return (
    <div className={classList}>
      <button className={mc("scale-select__button")} onClick={() => useVibration(8, () => setScale(0.75))}>
        <Icon type="text" />
        <span>Small</span>
      </button>
      <button className={mc("scale-select__button")} onClick={() => useVibration(8, () => setScale(1))}>
        <Icon type="text" />
        <span>Medium</span>
      </button>
      <button className={mc("scale-select__button")} onClick={() => useVibration(8, () => setScale(1.25))}>
        <Icon type="text" />
        <span>Large</span>
      </button>
    </div>
  );
}
