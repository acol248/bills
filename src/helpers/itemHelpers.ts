import type { Item } from "../hooks/useData";

/**
 * Append suffix to date number
 *
 * @param day date as number to append suffix to
 * @returns day + suffix as string
 */
export function addDateSuffix(day: number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const teenException = day >= 13 && day <= 19;
  const lastDigit = day % 10;

  return day + (teenException ? "th" : suffixes[lastDigit] || "th");
}

/**
 * Sort items array by day of the month where today is the start of the array
 *
 * @param arr array of items
 */
export function sortItemsByDate(items: Array<Item>) {
  const currentDay = new Date().getDate();

  /**
   * Get the day from an item date string (mm/dd/yyyy)
   *
   * @param dateStr item date input string
   */
  const getDay = (date: Item["date"]) => {
    const _d = new Date(date);

    return { y: _d.getFullYear(), m: _d.getMonth(), d: _d.getDate() };
  };

  /**
   * Calculate the effective day difference considering only the day of the month\
   *
   * @param day input day number
   */
  const getDayDiff = ({ y, m, d }: { y: number; m: number; d: number }) => {
    const dtm = new Date(y, m + 1, 0).getDate();

    return d >= currentDay ? d - currentDay : d + dtm - currentDay;
  };

  // Sort the array based on the effective day differences
  items.sort((a, b) => getDayDiff(getDay(a.date)) - getDayDiff(getDay(b.date)));

  return items;
}

/**
 * Get the total value of all items left in this month
 *
 * @param arr array of items
 * @returns totalled up value
 */
export function sumRemainingItems(items: Array<Item>) {
  const currentDay = new Date().getDate();

  return items.reduce((a, { value }) => {
    const day = new Date().getDate();

    if (day < currentDay) return a;

    return (a += value);
  }, 0);
}
