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

/**
 * Convert a BufferArray to a String
 *
 * @param input BufferArray
 * @returns converted string
 */
export function bufferToString(input: ArrayBuffer) {
  return Array.from(new Uint8Array(input))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}
