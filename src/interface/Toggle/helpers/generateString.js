/**
 * Generates random string
 * 
 * @param {number} len length of string
 * @returns generated string
 */
export default function generateString(len) {
  let gen = "";
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz#@$%^&*!~";
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charset.length);
    gen += charset.substring(randomPoz, randomPoz + 1);
  }
  return gen;
}
