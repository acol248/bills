import { Fragment, useContext } from "react";

// hooks
import { DataContext, Item } from "../../hooks/useData";

// components
import ListItem from "../../components/ListItem";

// helpers
import { sortItemsByDate, sumRemainingItems, addDateSuffix } from "../../helpers/itemHelpers";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./UpComing.module.scss";
import { formatCurrency } from "../../helpers/formatCurrency";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

export default function UpComing() {
  const { items, removeItem, setCurrentlyEditing, setAddItemOpen } = useContext(DataContext);

  const classList = useClassList({
    defaultClass: "up-coming",
    maps,
    string: true,
  }) as string;

  const openEdit = (targetId: Item["id"]) => {
    setCurrentlyEditing(targetId);
    setAddItemOpen(true);
  };

  return (
    <div className={classList}>
      <div className={mc("up-coming__overview")}>
        <span>£{sumRemainingItems(items)}</span> left this month
        <p className={mc("up-comping__subtle")}>{formatCurrency(items.reduce((a, c) => (a += c.value), 0))} total</p>
      </div>

      <div className={mc("up-coming__items")}>
        {sortItemsByDate(items).map(({ id, name, value, date }, index) => (
          <Fragment key={name + date + value}>
            {new Date(date).getDate() !== new Date(items?.[index - 1]?.date).getDate() && (
              <p className={mc("up-coming__date")}>{addDateSuffix(new Date(date).getDate())}</p>
            )}

            <ListItem
              label={name}
              value={value}
              date={date}
              onEdit={() => openEdit(id)}
              onDelete={() => removeItem(id)}
            />

            {new Date(date).getDate() > new Date(items?.[index + 1]?.date).getDate() && <hr />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
