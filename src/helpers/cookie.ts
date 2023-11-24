/**
 * Get cookie by name
 *
 * @param name name of cookie
 * @returns cookie value or null
 */
export function getCookie(name: string) {
  const cookies = document.cookie?.split(";");

  if (!cookies) return null;

  for (let i = 0; i < cookies?.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.startsWith(name + "=")) return cookie.substring(name.length + 1);
  }

  return null;
}

/**
 * Set a cookie with a value and expiration
 *
 * @param name name of cookie
 * @param value cookie value
 * @param expirationDays number of days cookie should exist for
 */
export function setCookie(name: string, value: string, expirationDays: number) {
  const date = new Date();

  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();

  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
