import { useMemo } from "react";

// styles
import styles from "./Button.module.scss";

// types
import type { IButton } from "./Button.interface";

export default function Button({ className, variant, onClick, icon, children, ...props }: IButton) {
  const classList = useMemo(() => {
    const _classlist = [styles["button"]];

    if (className) for (const item of className.split(" ")) _classlist.push(item);

    if (variant) for (const item of variant.split(" ")) _classlist.push(styles[`button--${item}`]);

    return _classlist.join(" ");
  }, [className, variant]);

  return (
    <button className={classList} onClick={onClick} {...props}>
      {icon && icon} <span>{children}</span>
    </button>
  );
}
