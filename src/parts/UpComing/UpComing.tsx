import { useContext } from "react";

// hooks
import { DataContext } from "../../hooks/useData";

// components
import Item from "../../components/Item";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./UpComing.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

export default function UpComing() {
  const { items } = useContext(DataContext);

  const classList = useClassList({
    defaultClass: "up-coming",
    maps,
    string: true,
  }) as string;

  console.log(items);

  return (
    <div className={classList}>
      <div className={mc("up-coming__overview")}>
        <span>£250.58</span> <br /> to go
      </div>

      <div className={mc("up-coming__items")}>
        {items.map(({ name, value }) => (
          <Item label={name} value={value.toString()} />
        ))}
      </div>
    </div>
  );
}
