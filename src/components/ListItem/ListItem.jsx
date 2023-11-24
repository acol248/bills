import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// styles
import maps from "./ListItem.module.scss";
import { useCallback } from "react";
const mc = mapClassesCurried(maps, true);

export default function ListItem({
  className,
  variant,
  open,
  onToggle,
  name,
  value,
  children,
  ...props
}) {
  const classList = useClassList(
    { defaultClass: "list-item", className, variant, maps, string: true },
    useCallback((_c) => open && _c.push("list-item--open"), [open])
  );

  const handleToggle = (e) => {
    e.preventDefault();

    document.activeElement.blur();

    typeof onToggle === "function" && onToggle(e);
  };

  return (
    <details {...props} className={classList} open={open}>
      <summary onClick={handleToggle}>
        <span className={mc("list-item__value")}>£{value}</span>
        {name}
      </summary>

      <div className={mc("list-item__body")}>{children}</div>
    </details>
  );
}
