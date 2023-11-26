import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// styles
import maps from "./Button.module.scss";
const mc = mapClassesCurried(maps, true) as (cn: string | string[]) => string;

// types
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  icon?: ReactNode;
}

export default function Button({ className, variant, icon, children, ...props }: IButton) {
  const classList = useClassList({ defaultClass: "button", className, variant, maps, string: true }) as string;

  return (
    <button className={classList} {...props}>
      <span className={mc("button__inner")}>{children}</span>
      {icon && icon}
    </button>
  );
}
