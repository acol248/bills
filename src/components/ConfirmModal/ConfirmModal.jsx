import { useContext } from "react";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Modal from "../Modal";
import Button from "../../interface/Button";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./ConfirmModal.module.scss";
const mc = mapClassesCurried(maps, true);

export default function ConfirmModal({ className, title, children, open, onClose, action }) {
  const { useVibration } = useContext(SettingsContext);

  const classList = useClassList({ defaultClass: "confirm-modal", className, maps, string: true });

  return (
    <Modal className={classList} open={open} onClose={onClose} title={title}>
      <p className={mc("confirm-modal__body")}>{children}</p>

      <div className={mc("confirm-modal__buttons")}>
        <Button onClick={() => useVibration({ callback: onClose })}>Cancel</Button>
        <Button onClick={() => useVibration({ callback: action })}>Confirm</Button>
      </div>
    </Modal>
  );
}
