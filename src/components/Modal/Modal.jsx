import { useRef, useCallback, useEffect, useContext } from "react";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// components
import Icon from "./Modal.icons";

// styles
import maps from "./Modal.module.scss";
import { vibrate } from "../../helpers/vibrate";
import { SettingsContext } from "../../hooks/useSettings";
const mc = mapClassesCurried(maps, true);

export default function Modal({ className, variant, title, open, onClose, children, locked, onTransitionEnd }) {
  const { useVibration } = useContext(SettingsContext);

  const modalRef = useRef(null);

  const classList = useClassList(
    { defaultClass: "modal", className, variant, maps, string: true },
    useCallback(_c => !open && _c.push("modal--closing"), [open])
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
      if (target === el && !locked) onClose();
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
      <div className={mc("modal__header")} tabIndex={0}>
        <h2 className={mc("modal__title")}>{title}</h2>

        <button className={mc("modal__close")} onClick={() => useVibration(8, () => onClose())}>
          <Icon type="close" />
        </button>
      </div>

      <div className={mc("modal__body")}>{children}</div>
    </dialog>
  );
}
