import {
  forwardRef,
  useState,
  useRef,
  useLayoutEffect,
  useContext,
} from "react";

// hooks
import { ThemeContext } from "../../hooks/useTheme";

// helpers
import generateString from "../../helpers/generateString";

// styles
import styles from "./Checkbox.module.scss";

function Checkbox(
  { className, variant, onClick, icon, children, ...props },
  ref
) {
  const { theme } = useContext(ThemeContext);

  const idRef = useRef(generateString(8));

  const [classlist, setClasslist] = useState([]);

  // classlist, variant and theme
  useLayoutEffect(() => {
    const _classlist = [styles["checkbox"]];

    if (className)
      for (const item of className.split(" ")) _classlist.push(item);

    if (variant)
      for (const item of variant.split(" "))
        _classlist.push(styles[`checkbox--${item}`]);

    _classlist.push(styles[`checkbox--${theme}`]);

    setClasslist(_classlist.join(" "));
  }, [className, variant, theme]);

  return (
    <label className={classlist} htmlFor={idRef.current}>
      <span className={styles["checkbox__label"]}>{children}</span>
      <input
        type="checkbox"
        id={idRef.current}
        ref={ref ? ref : null}
        {...props}
      />
      <span className={styles["checkbox__checkmark"]}></span>
    </label>
  );
}

export default forwardRef(Checkbox);
