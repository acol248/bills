import { useState } from "react";

// components
import Modal from "../Modal";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./SelectList.modules.scss";
const mc = mapClassesCurried(maps, true);

export default function SelectList({ className, children, list = [], onSelect = () => {} }) {
  const [isOpen, setIsOpen] = useState();

  const classList = useClassList({ defaultClass: "select-list", className, variant, maps, string: true });

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
      <button className={mc("select-list__button")} onClick={() => setIsOpen(true)}>
        {children}
      </button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        {Boolean(list.length > 0) && list.map(name => <button onClick={() => handleSelect(name)}>{name}</button>)}
      </Modal>
    </div>
  );
}
