import { Fragment, useContext, useRef } from "react";
import { motion } from "framer-motion";

// hooks
import { DataContext, Item } from "../../hooks/useData";

// components
import ListItem from "../../components/ListItem";

// helpers
import { sortItemsByDate, sumRemainingItems, addDateSuffix } from "../../helpers/itemHelpers";
import { formatCurrency } from "../../helpers/format";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./UpComing.module.scss";
import Overview from "../../components/Overview";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

export default function UpComing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);

  const { items, removeItem, setCurrentlyEditing, setAddItemOpen } = useContext(DataContext);

  const classList = useClassList({
    defaultClass: "up-coming",
    maps,
    string: true,
  }) as string;

  /**
   * Open edit panel, by id
   *
   * @param targetId id of item to edit
   */
  const openEdit = (targetId: Item["id"]) => {
    setCurrentlyEditing(targetId);
    setAddItemOpen(true);
  };

  return (
    <motion.div
      className={classList}
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.125, ease: "easeInOut" }}
    >
      <Overview items={items} />

      <div className={mc("up-coming__items")}>
        {sortItemsByDate(items).map(({ id, name, value, date }, index) => (
          <Fragment key={name + date + value}>
            {new Date(date).getDate() !== new Date(items?.[index - 1]?.date).getDate() && (
              <p className={mc("up-coming__date")}>{addDateSuffix(new Date(date).getDate())}</p>
            )}

            <ListItem label={name} value={value} onEdit={() => openEdit(id)} onDelete={() => removeItem(id)} />

            {new Date(date).getDate() > new Date(items?.[index + 1]?.date).getDate() && <hr />}
          </Fragment>
        ))}
      </div>
    </motion.div>
  );
}
