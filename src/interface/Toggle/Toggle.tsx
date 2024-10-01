import { useState, useEffect, forwardRef, useRef, HTMLProps } from "react";

// styles
import styles from "./Toggle.module.scss";

// types

interface IToggle extends HTMLProps<HTMLInputElement> {
  variant?: string;
}

/**
 * Generate random string
 * 
 * @param length target length of return string
 * @returns random string based on length param
 */
function generateString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

const Toggle = forwardRef<HTMLInputElement, IToggle>(({ className, variant, children, ...props }, ref) => {
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
});

Toggle.displayName = "Toggle";

export default Toggle;
