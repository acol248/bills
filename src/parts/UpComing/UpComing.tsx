import { useContext } from "react";

// hooks
import { DataContext } from "../../hooks/useData";

// components
import ListItem from "../../components/ListItem";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./UpComing.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

// types
import type { Item } from "../../hooks/useData";

export default function UpComing() {
  const { items } = useContext(DataContext);

  const classList = useClassList({
    defaultClass: "up-coming",
    maps,
    string: true,
  }) as string;

  /**
   * Sort items array by day of the month where today is the start of the array
   *
   * @param arr array of items
   */
  const sortDatesByCurrentToNextMonth = (arr: Array<Item>) => {
    const currentDay = new Date().getDate();

    /**
     * Get the day from an item date string (mm/dd/yyyy)
     * 
     * @param dateStr item date input string
     */
    const getDay = (dateStr: Item["date"]) => dateStr.split("/").map(Number)[1];

    /**
     * Calculate the effective day difference considering only the day of the month\
     * 
     * @param day input day number
     */
    const getDayDiff = (day: number) => (day >= currentDay ? day - currentDay : day + 30 - currentDay);

    // Sort the array based on the effective day differences
    arr.sort((a, b) => getDayDiff(getDay(a.date)) - getDayDiff(getDay(b.date)));

    return arr;
  };

  /**
   * Get the total value of all items left in this month
   * 
   * @param arr array of items
   * @returns totalled up value
   */
  const sumCurrentMonthValues = (arr: Array<Item>) => {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth() + 1;

    return arr.reduce((a, { value, date }) => {
      const [month, day] = date.split("/").map(Number);

      if (month !== currentMonth || day < currentDay) return a;

      return (a += value);
    }, 0);
  };

  return (
    <div className={classList}>
      <div className={mc("up-coming__overview")}>
        <span>£{sumCurrentMonthValues(items)}</span> <br /> to go
      </div>

      <div className={mc("up-coming__items")}>
        {sortDatesByCurrentToNextMonth(items).map(({ name, value, date }) => (
          <ListItem label={name} value={value.toString()} date={date} />
        ))}
      </div>
    </div>
  );
}
