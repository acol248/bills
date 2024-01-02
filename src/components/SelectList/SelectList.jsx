import { useCallback, useState } from "react";

// components
import Modal from "../Modal";
import Icon from "./SelectList.icons";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./SelectList.module.scss";
const mc = mapClassesCurried(maps, true);

export default function SelectList({ className, children, list = [], selectedList, onSelect = () => {} }) {
  const [isOpen, setIsOpen] = useState();

  const classList = useClassList(
    { defaultClass: "select-list", className, maps, string: true },
    useCallback(c => selectedList && c.push("select-list--value"), [selectedList])
  );

  /**
   * Close modal and make selection
   *
   * @param {string} name name of selected list item
   */
  const handleSelect = name => {
    setIsOpen(false);
    onSelect(name);
  };

  return (
    <div className={classList}>
      <button className={mc("select-list__button")} onClick={() => setIsOpen(true)} type="button">
        {selectedList ? selectedList : children}
      </button>

      <Modal className={mc("select-modal")} title="Categories" open={isOpen} onClose={() => setIsOpen(false)}>
        <div className={mc("select-modal__inner")}>
          {Boolean(list.length > 0) &&
            list.map(name => (
              <button
                className={mc("select-modal__button")}
                onClick={() => handleSelect(name)}
                key={name}
                type="button"
              >
                <Icon type={selectedList === name ? "checked" : "unchecked"} />
                {name}
              </button>
            ))}
        </div>
      </Modal>
    </div>
  );
}
