import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// hooks
import { DataContext, Item } from "../../hooks/useData";
import { SettingsContext } from "../../hooks/useSettings";
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
  const { privacyMode } = useContext(SettingsContext);

  const [hidden, setHidden] = useState<boolean>(true);

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
      {privacyMode && (
        <button
          onClick={() => setHidden(h => !h)}
          className={mc("up-coming__privacy")}
          aria-label="Toggle Privacy Mode"
          title="Toggle Privacy Mode"
        >
          {hidden ? (
            <svg viewBox="0 -960 960 960">
              <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
            </svg>
          ) : (
            <svg viewBox="0 -960 960 960">
              <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
            </svg>
          )}
        </button>
      )}

      <div className={mc("up-coming__overview")} ref={overviewRef}>
        <div className={mc("up-coming__month-total")}>
          <span>{privacyMode && hidden ? "??" : formatCurrency(sumRemainingItems(items))}</span> left this month
        </div>
        <p className={mc("up-comping__subtle")}>
          {privacyMode && hidden ? "??" : formatCurrency(items.reduce((a, c) => (a += c.value), 0))} total
        </p>
      </div>

      <div className={mc("up-coming__items")}>
        {sortItemsByDate(items).map(({ id, name, value, date }, index) => (
          <Fragment key={name + date + value}>
            {new Date(date).getDate() !== new Date(items?.[index - 1]?.date).getDate() && (
              <p className={mc("up-coming__date")}>{addDateSuffix(new Date(date).getDate())}</p>
            )}

            <ListItem
              label={name}
              value={privacyMode && hidden ? "??" : value}
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
