import { useState, useEffect, forwardRef, useRef } from "react";

// styles
import styles from "./Toggle.module.scss";

/**
 * Generates random string
 *
 * @param {number} len length of string
 * @returns generated string
 */
function generateString(len) {
  let gen = "";
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz#@$%^&*!~";
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charset.length);
    gen += charset.substring(randomPoz, randomPoz + 1);
  }
  return gen;
}

function Toggle({ className, variant, children, ...props }, ref) {
  const idRef = useRef(generateString(8));

  const [classlist, setClasslist] = useState("");

  // classlist and variant
  useEffect(() => {
    const _classlist = [styles["toggle"]];

    if (className) for (const item of className.split(" ")) _classlist.push(item);

    if (variant) for (const item of variant.split(" ")) _classlist.push(styles[`toggle--${item}`]);

    setClasslist(_classlist.join(" "));
  }, [className, variant]);

  return (
    <div className={classlist}>
      <label className={styles["toggle__label"]}>{children}</label>

      <div className={styles["toggle__switch"]}>
        <input className={styles["toggle__switch-checkbox"]} type="checkbox" id={idRef.current} ref={ref} {...props} />
        <label className={styles["toggle__switch-highlight"]} htmlFor={idRef.current}></label>
      </div>
    </div>
  );
}

export default forwardRef(Toggle);
