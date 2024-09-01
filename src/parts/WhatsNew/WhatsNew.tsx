import { useContext, useState } from "react";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Modal from "../../components/Modal";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./WhatsNew.module.scss";
const mc = mapClassesCurried(maps, true);

// types
interface Props {
  className?: Element["className"];
}

export default function WhatsNew({ className }: Props) {
  const { authenticated } = useContext(SettingsContext);

  const [isOpen, setIsOpen] = useState(false);

  const classList = useClassList({ defaultClass: "new", className, maps, string: true });

  return (
    authenticated && (
      <>
        <button className={classList} onClick={() => setIsOpen(true)} aria-label="See what's new">
          <svg viewBox="0 -960 960 960">
            <path d="M480-80q-26 0-47-12.5T400-126q-33 0-56.5-23.5T320-206v-142q-59-39-94.5-103T190-590q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 77-35.5 140T640-348v142q0 33-23.5 56.5T560-126q-12 21-33 33.5T480-80Zm-80-126h160v-36H400v36Zm0-76h160v-38H400v38Zm-8-118h58v-108l-88-88 42-42 76 76 76-76 42 42-88 88v108h58q54-26 88-76.5T690-590q0-88-61-149t-149-61q-88 0-149 61t-61 149q0 63 34 113.5t88 76.5Zm88-162Zm0-38Z" />
          </svg>
        </button>

        <Modal className={mc("new-modal")} title="What's New?" open={isOpen} onClose={() => setIsOpen(false)}>
          <div className={mc("new-modal__inner")}>
            <ul className={mc("new-modal__list")}>
              <li className={mc("new-modal__item")}>
                <span className={mc("new-modal__title")}>Content Scaling</span>
                <br />
                Content can be scaled incase the default size on your device isn't quite what you'd like.
              </li>
              <li className={mc("new-modal__item")}>
                <span className={mc("new-modal__title")}>Testing Authentication</span>
                <br />A lock screen for the app can now be set. Improvements are required including further content
                obfuscation.
              </li>
            </ul>
          </div>
        </Modal>
      </>
    )
  );
}
