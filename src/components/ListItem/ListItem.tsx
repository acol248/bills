// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./ListItem.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

// types
interface ItemProps {
  className?: Element["className"];
  label: string;
  value: string;
  date: string;
}

export default function ListItem({ className, label, value, date }: ItemProps) {
  const classList = useClassList({ defaultClass: "list-item", className, maps, string: true }) as string;

  return (
    <div className={classList}>
      <div className={mc('list-item__left')}>
        <p className={mc("list-item__label")}>{label}</p>
        <p className={mc("list-item__value")}>{value}</p>
      </div>

      <p className={mc("list-item__date")}>{new Date(date).getDate()}</p>
    </div>
  );
}
