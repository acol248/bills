// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./ListItem.module.scss";
import { addDateSuffix } from "../../helpers/itemHelpers";
import { formatCurrency } from "../../helpers/formatCurrency";
import Button from "../../interface/Button";
import { useState } from "react";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

// types
interface ItemProps {
  className?: Element["className"];
  label: string;
  value: number;
  date: Date;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ListItem({ className, label, value, date, onEdit, onDelete }: ItemProps) {
  const [open, setOpen] = useState<boolean>(false);

  const classList = useClassList({ defaultClass: "list-item", className, maps, string: true }) as string;

  return (
    <div className={classList} aria-checked={open}>
      <button className={mc("list-item__content")} type="button" role="switch" onClick={() => setOpen(o => !o)}>
        <div className={mc("list-item__left")}>
          <p className={mc("list-item__label")}>{label}</p>
          <p className={mc("list-item__value")}>{formatCurrency(value)}</p>
        </div>

        <p className={mc("list-item__date")}>{addDateSuffix(new Date(date).getDate())}</p>
      </button>

      <div className={mc("list-item__controls")}>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}
