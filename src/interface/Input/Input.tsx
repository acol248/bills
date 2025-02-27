import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// styles
import maps from "./Input.module.scss";
const mc = mapClassesCurried(maps, true) as (cn: string | string[]) => string;

// types
import type { InputHTMLAttributes } from "react";

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  variant?: string;
  label: string;
}

export default function Input({ className, variant, label, ...props }: IInput) {
  const classList = useClassList({ defaultClass: "input", className, variant, maps, string: true }) as string;

  return (
    <label className={classList}>
      <span className={mc("input__text")}>{label}</span>

      <input className={mc("input__input")} {...props} />
    </label>
  );
}
