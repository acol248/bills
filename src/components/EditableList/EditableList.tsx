// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./EditableList.module.scss";
import Avatar from "../Avatar";
const mc = mapClassesCurried(maps, true);

type Item = {
  id: string;
  name: string;
  value: number;
};

interface Props {
  className?: string;
  items?: Array<Item>;
  onAdd?: () => void;
  onRemove?: (id: string) => void;
}

export default function EditableList({ className, items = [], onAdd, onRemove }: Props) {
  const classList = useClassList({ defaultClass: "list", className, maps, string: true });

  return (
    <div className={classList}>
      {items.map(({ id, name, value }) => {
        const nameSplit = name.split(" ");
        const short = `${nameSplit[0].split("")[0]}${
          nameSplit.length > 1 ? `${nameSplit[nameSplit.length - 1].split("")[0]}` : ""
        }`;

        return (
          <div className={mc("list__item")} key={id}>
            <Avatar className={mc("list__avatar")} fallback={short} />
            <p>{name}</p>
            <p>£{value}</p>
            <button className={mc("list__remove")} type="button" onClick={() => onRemove?.(id)}>
              <svg viewBox="0 -960 960 960">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
            </button>
          </div>
        );
      })}

      <button className={mc("list__add")} onClick={onAdd}>
        Add
      </button>
    </div>
  );
}
