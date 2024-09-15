/**
 * Trigger vibration
 *
 * @param time duration of vibration in ms
 * @param callback function to run after vibration triggered
 * @returns run callback, if applicable
 */
export function vibrate(time: number = 50, callback: () => void) {
  navigator.vibrate(time);

  return callback && callback();
}
