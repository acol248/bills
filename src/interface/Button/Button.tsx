import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// styles
import maps from "./Button.module.scss";
const mc = mapClassesCurried(maps, true) as (cn: string | string[]) => string;

// types
import { useCallback, type ButtonHTMLAttributes, type ReactNode } from "react";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  icon?: ReactNode;
}

export default function Button({ className, variant, icon, children, ...props }: IButton) {
  const classList = useClassList(
    { defaultClass: "button", className, variant, maps, string: true },
    useCallback(
      (_c: string[]) => {
        !children && icon && _c.push("button--icon-only");
      },
      [children, icon]
    )
  ) as string;

  return (
    <button className={classList} {...props}>
      {children && <span className={mc("button__text")}>{children}</span>}
      {icon && icon}
    </button>
  );
}
