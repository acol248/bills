import { useContext, useState } from "react";

// components
import Button from "../../interface/Button";

// helpers
import { formatCurrency } from "../../helpers/format";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./ListItem.module.scss";
import { SettingsContext } from "../../hooks/useSettings";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

// types
interface ItemProps {
  className?: Element["className"];
  label: string;
  value: number | "??";
  onEdit: () => void;
  onDelete: () => void;
}

export default function ListItem({ className, label, value, onEdit, onDelete }: ItemProps) {
  const { vibrate } = useContext(SettingsContext);

  const [open, setOpen] = useState<boolean>(false);

  const classList = useClassList({ defaultClass: "list-item", className, maps, string: true }) as string;

  return (
    <div className={classList} aria-checked={open}>
      <button
        className={mc("list-item__content")}
        type="button"
        role="switch"
        aria-selected={open}
        onClick={() => vibrate({ callback: () => setOpen(o => !o) })}
      >
        <div className={mc("list-item__left")}>
          <p className={mc("list-item__label")}>{label}</p>
          <p className={mc("list-item__value")}>{typeof value === "string" ? value : formatCurrency(value)}</p>
        </div>

        <svg viewBox="0 -960 960 960">
          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
        </svg>
      </button>

      <div className={mc("list-item__controls")}>
        <Button onClick={() => vibrate({ callback: () => onEdit() })}>Edit</Button>
        <Button onClick={() => vibrate({ callback: () => onDelete() })}>Delete</Button>
      </div>
    </div>
  );
}
