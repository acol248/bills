import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// maps
import maps from "./MenuItem.module.scss";
const mc = mapClassesCurried(maps, true);

export default function MenuItem({ className, variant, children }) {
  const classList = useClassList({ defaultClass: "menu-button", className, variant, maps, string: true });

  return (
    <button className={classList}>
      <p className={mc("menu-button__content")}>{children}</p>
    </button>
  );
}
