import { useCallback, useContext, useState } from "react";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Icon from "./Category.icons";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Category.module.scss";
const mc = mapClassesCurried(maps, true);

export default function Category({ className, name, total, onDelete = () => {}, children }) {
  const { useVibration } = useContext(SettingsContext);

  const [isOpen, setIsOpen] = useState(false);

  const classList = useClassList(
    { defaultClass: "category", className, maps, string: true },
    useCallback(c => isOpen && c.push("category--open"), [isOpen])
  );

  /**
   * Handle programatic open close toggle of details element
   *
   * @param {Event} e onclick event
   */
  const handleToggle = e => {
    e.preventDefault();
    setIsOpen(o => !o);

    useVibration();
  };

  return (
    <details className={classList} open={isOpen}>
      <summary className={mc("category__summary")} onClick={handleToggle}>
        <div className={mc("category__text")}>
          <h2>{name}</h2>
          <h4>{total}</h4>
        </div>

        <Icon type={isOpen ? "remove" : "add"} />
      </summary>

      <div className={mc("category__body")}>
        {children}

        <button
          className={mc("category__remove-category")}
          onClick={() => useVibration({ callback: () => onDelete(name) })}
        >
          Remove Category
        </button>
      </div>
    </details>
  );
}
