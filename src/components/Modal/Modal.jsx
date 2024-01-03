import { useRef, useCallback, useEffect, useContext } from "react";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Icon from "./Modal.icons";

// styles
import maps from "./Modal.module.scss";
const mc = mapClassesCurried(maps, true);

export default function Modal({
  className,
  variant,
  title,
  open,
  onClose = () => {},
  children,
  locked = false,
  onTransitionEnd,
}) {
  const { useVibration } = useContext(SettingsContext);

  const modalRef = useRef(null);

  const classList = useClassList(
    { defaultClass: "modal", className, variant, maps, string: true },
    useCallback(_c => !open && _c.push("modal--closing"), [open])
  );

  /**
   * Eventlistener: trigger close when close modal event
   */
  const handleClose = useCallback(e => {
    e?.preventDefault();
    e?.stopPropagation();

    onClose();
  }, []);

  /**
   * Eventlistener: trigger onclose when cancel detected
   */
  const onCancel = useCallback(
    e => {
      e.preventDefault();

      if (!locked) handleClose(e);
    },
    [locked, handleClose]
  );

  /**
   * Eventlistener: trigger onclose when click outside
   */
  const onClick = useCallback(
    e => {
      const { current: el } = modalRef;
      if (e.target === el && !locked) handleClose(e);
    },
    [locked, handleClose]
  );

  /**
   * Eventlistener: trigger close click on anim end
   */
  const onAnimEnd = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();

      const { current: el } = modalRef;

      if (!open) el.close();

      onTransitionEnd && onTransitionEnd();
    },
    [open]
  );

  // when open changes run open/close command
  useEffect(() => {
    const { current: el } = modalRef;
    if (open) el.showModal();
  }, [open]);

  return (
    <dialog
      className={classList}
      onClose={handleClose}
      onCancel={onCancel}
      onClick={onClick}
      onAnimationEnd={onAnimEnd}
      ref={modalRef}
    >
      <div className={mc("modal__header")} tabIndex={0}>
        <h2 className={mc("modal__title")}>{title}</h2>

        <button className={mc("modal__close")} onClick={e => useVibration({ callback: () => handleClose(e) })}>
          <Icon type="close" />
        </button>
      </div>

      <div className={mc("modal__body")}>{children}</div>
    </dialog>
  );
}
