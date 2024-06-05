import { forwardRef, useState, useCallback, ReactNode } from "react";

// components
import Icon from "./Select.icon";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Select.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

interface ISelect {
  className?: HTMLDivElement["className"];
  variant?: string;
  items: Array<{
    text: string;
    payload: string | number;
  }>;
  selected: number;
  selectedPayload: (n: number) => void;
  children?: ReactNode | ReactNode[];
}

const Select = forwardRef<HTMLDivElement, ISelect>(
  ({ className, variant, items, selected, selectedPayload, children }, ref) => {
    const [selectedOpen, setSelectedOpen] = useState<boolean>(false);

    const classList = useClassList(
      { defaultClass: "select", className, variant, maps, string: true },
      useCallback(
        (c: string[]) => {
          selectedOpen && c.push("select--open");
        },
        [selectedOpen]
      )
    ) as string;

    /**
     * Handle select
     */
    const handleSelect = (index: number) => {
      selectedPayload(index);

      console.log(index);

      setSelectedOpen(false);
    };

    return (
      <div className={classList}>
        <span className={mc("select__label")}>{children}</span>
        <div className={mc("select__dropdown")} ref={ref}>
          <button className={mc("select__persistent")} onClick={() => setSelectedOpen(s => !s)} type="button">
            <span>{selected > -1 ? items[selected]?.text : "-"}</span>
            <Icon type="expand" />
          </button>

          <div className={mc("select__dropmenu")}>
            {items &&
              items.map(({ text, payload }, index) => (
                <button
                  key={text + payload}
                  className={mc("select__dropmenu-item")}
                  onClick={() => handleSelect(index)}
                  type="button"
                >
                  {text}
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
