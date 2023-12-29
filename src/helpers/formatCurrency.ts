/**
 * Format number as currency ready string
 *
 * @param number input number
 * @returns formatted number as string
 */
export function formatCurrency(number: number): string {
  // Use Intl.NumberFormat to format based on user's locale
  const formatter = new Intl.NumberFormat("default", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(number);
}
