import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// maps
import maps from "./MenuItem.module.scss";
const mc = mapClassesCurried(maps, true);

export default function MenuItem({ className, variant, label, content }) {
  const classList = useClassList({ defaultClass: "menu-item", className, variant, maps, string: true });

  return <div className={classList}></div>;
}
