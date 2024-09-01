/**
 * Generate random string at given length
 *
 * @param length desired length of string
 * @returns generated string
 */
export function generateString(length: number = 1): string {
  if (!length || length <= 0) throw new Error("Length must be a positive integer.");

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from({ length }, () => {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }).join('');
}
