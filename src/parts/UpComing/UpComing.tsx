import { Fragment, useContext, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// hooks
import { DataContext, Item } from "../../hooks/useData";
import useMediaQuery from "@blocdigital/usemediaquery";

// components
import ListItem from "../../components/ListItem";

// helpers
import { sortItemsByDate, sumRemainingItems, addDateSuffix } from "../../helpers/itemHelpers";
import { formatCurrency } from "../../helpers/format";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./UpComing.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

export default function UpComing() {
  const [isMobile] = useMediaQuery("(max-width: 767px) and (max-height: 551px)");

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

  // trigger scroll lift anim
  useEffect(() => {
    if (!isMobile) return;

    const { current: container } = containerRef;

    if (!container) return;

    const updateScroll = () => {
      const { current: overview } = overviewRef;

      if (!overview) return;

      if ((containerRef.current?.scrollTop ?? 0) > 0) {
        overview.style.setProperty("box-shadow", "1px 1px 8px 1px rgba(0, 0, 0, 0.09)");
      } else {
        overview.style.removeProperty("box-shadow");
      }
    };

    container.addEventListener("scroll", updateScroll);

    return () => container.removeEventListener("scroll", updateScroll);
  }, [isMobile]);

  return (
    <motion.div
      className={classList}
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.125, ease: "easeInOut" }}
    >
      <div className={mc("up-coming__overview")} ref={overviewRef}>
        <div className={mc("up-coming__month-total")}>
          <span>{formatCurrency(sumRemainingItems(items))}</span> left this month
        </div>
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
    </motion.div>
  );
}
