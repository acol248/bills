import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Category.module.scss";
const mc = mapClassesCurried(maps, true);

export default function Category({ className, name, children }) {
  const classList = useClassList({ defaultClass: "category", className, maps, string: true });

  return (
    <details className={classList}>
      <summary className={mc("category__summary")}>{name && <h2>{name}</h2>}</summary>

      <div className={mc("category__body")}>{children}</div>
    </details>
  );
}
