import { useContext, useEffect, useState } from "react";
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

  const [constraints, setConstraints] = useState({
    min: Math.round(0.7 * (window.innerWidth / 375) * 10) / 10,
    max: Math.round(1.3 * (window.innerWidth / 375) * 10) / 10,
    default:
      Math.round(
        (0.7 * (window.innerWidth / 375) + (1.3 * (window.innerWidth / 375) - 0.7 * (window.innerWidth / 375)) / 2) * 10
      ) / 10,
  });

  const classList = useClassList({ defaultClass: "scale-select", className, maps, string: true });

  /**
   * Increase scale by 0.1, up to 1.3
   */
  const handleIncreaseScale = () => setScale(settings.scale < constraints.max ? settings.scale + 0.1 : constraints.max);

  /**
   * Reduce scale by 0.1, up to 0.7
   */
  const handleReduceScale = () => setScale(settings.scale > constraints.min ? settings.scale - 0.1 : constraints.min);

  // listen for window size change
  useEffect(() => {
    const handleResize = () => {
      const _constraints = {
        min: Math.round(0.7 * (window.innerWidth / 375) * 10) / 10,
        max: Math.round(1.3 * (window.innerWidth / 375) * 10) / 10,
        default:
          Math.round(
            (0.7 * (window.innerWidth / 375) +
              (1.3 * (window.innerWidth / 375) - 0.7 * (window.innerWidth / 375)) / 2) *
              10
          ) / 10,
      };

      setConstraints(_constraints);
      setScale(_constraints.default);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={classList}>
      <span>Display Scale</span>

      <div className={mc("scale-select__scaler")}>
        <button className={mc("scale-select__button")} aria-label="Reduce display scale" onClick={handleReduceScale}>
          <Icon type="minus" />
        </button>
        <input
          type="range"
          onChange={({ target }) => useVibration({ callback: () => setScale(parseFloat(target.value)) })}
          step="0.1"
          min={constraints.min}
          max={constraints.max}
          value={settings.scale || constraints.default}
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
