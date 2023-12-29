import { useCallback } from "react";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// styles
import maps from "./ListItem.module.scss";
const mc = mapClassesCurried(maps, true);

export default function ListItem({ className, variant, open, onToggle, name, value, date, children, ...props }) {
  const classList = useClassList(
    { defaultClass: "list-item", className, variant, maps, string: true },
    useCallback(_c => open && _c.push("list-item--open"), [open])
  );

  /**
   * Append the appropriate suffix for dates from the gregorian calendar
   *
   * @param {number} day numerical representation of current day
   * @returns {string} current day with appropriate suffix
   */
  const appendSuffix = day => {
    if (day >= 11 && day <= 13) return day + "th";

    const suffixes = ["th", "st", "nd", "rd"];

    return day + (suffixes[day % 10] || "th");
  };

  /**
   * Passthrough the toggle click event
   *
   * @param {Event} e
   */
  const handleToggle = e => {
    e.preventDefault();

    document.activeElement.blur();

    typeof onToggle === "function" && onToggle(e);
  };

  return (
    <details {...props} className={classList} open={open}>
      <summary onClick={handleToggle}>
        <div className={mc("list-item__left")}>
          <span className={mc("list-item__value")}>{value}</span>
          {name}
        </div>

        <h6 className={mc("list-item__date")}>{date ? appendSuffix(new Date(date)?.getDate()) : "--"}</h6>
      </summary>

      <div className={mc("list-item__body")}>{children}</div>
    </details>
  );
}
