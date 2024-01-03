import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// maps
import maps from "./MenuItem.module.scss";
const mc = mapClassesCurried(maps, true);

export default function MenuItem({ className, variant, label, children }) {
  const classList = useClassList({ defaultClass: "menu-item", className, variant, maps, string: true });

  return (
    <div className={classList}>
      {label && <h3 className={mc('menu-item__label')}>{label}</h3>}
      {children && <div className={mc('menu-item__content')}>{children}</div>}
    </div>
  );
}
