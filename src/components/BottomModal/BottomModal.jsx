import { useRef, useCallback, useEffect, useContext } from "react";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// styles
import maps from "./BottomModal.module.scss";
const mc = mapClassesCurried(maps, true);

export default function BottomModal({ className, variant, title, open, onClose, children, locked, onTransitionEnd }) {
  const { useVibration } = useContext(SettingsContext);

  const modalRef = useRef(null);

  const classList = useClassList(
    { defaultClass: "bottom-modal", className, variant, maps, string: true },
    useCallback(_c => !open && _c.push("bottom-modal--closing"), [open])
  );

  // Eventlistener: trigger onclose when cancel detected
  const onCancel = useCallback(
    e => {
      e.preventDefault();
      if (!locked) onClose();
    },
    [locked, onClose]
  );

  // Eventlistener: trigger onclose when click outside
  const onClick = useCallback(
    ({ target }) => {
      const { current: el } = modalRef;
      if (target === el && !locked) useVibration({ callback: () => onClose() });
    },
    [locked, onClose]
  );

  // Eventlistener: trigger close click on anim end
  const onAnimEnd = useCallback(() => {
    const { current: el } = modalRef;
    if (!open) el.close();

    onTransitionEnd && onTransitionEnd();
  }, [open]);

  // when open changes run open/close command
  useEffect(() => {
    const { current: el } = modalRef;
    if (open) el.showModal();
  }, [open]);

  return (
    <dialog
      className={classList}
      onClose={onClose}
      onCancel={onCancel}
      onClick={onClick}
      onAnimationEnd={onAnimEnd}
      ref={modalRef}
    >
      <div className={mc("bottom-modal__inner")} tabIndex={0}>
        <h2 className={mc("bottom-modal__title")}>{title}</h2>

        <div className={mc("bottom-modal__body")}>{children}</div>
      </div>
    </dialog>
  );
}
