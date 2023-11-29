export function vibrate(time: number = 50, callback: () => void) {
  navigator.vibrate(time);

  return callback && callback();
}