import { useState, useRef, useCallback, useContext } from "react";
import { useLayer } from "react-laag";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Icon from "./FloatingMenu.icons";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./FloatingMenu.module.scss";
const mc = mapClassesCurried(maps, true);

export default function FloatingMenu({ className, buttons }) {
  const { useVibration } = useContext(SettingsContext);

  const buttonRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen,
    onOutsideClick: () => setIsOpen(false),
    onDisappear: () => setIsOpen(false),
    placement: "top-end",
    overflowContainer: true,
    triggerOffset: 5,
    containerOffset: 16,
    container: () => buttonRef.current.parentElement,
  });

  const buttonClassList = useClassList(
    { defaultClass: "button", className, maps, string: true },
    useCallback(c => isOpen && c.push("button--open"), [isOpen])
  );
  const menuClassList = useClassList({ defaultClass: "menu", maps, string: true });

  /**
   * Tidy stuff in this component when a button function is run
   *
   * @param {Function} callback callback function
   */
  const handleFunc = callback => {
    setIsOpen(false);

    callback && callback();
  };

  return (
    <>
      <button
        {...triggerProps}
        type="button"
        aria-label="toggle floating menu"
        className={buttonClassList}
        ref={r => {
          buttonRef.current = r;
          triggerProps.ref(r);

          return r;
        }}
        onClick={() => useVibration({ callback: () => setIsOpen(o => !o) })}
      >
        <Icon type="add" />
      </button>

      {isOpen &&
        renderLayer(
          <div {...layerProps} className={menuClassList}>
            {Boolean(buttons.length > 0) &&
              buttons.map(({ label, icon, func }) => (
                <button
                  className={mc("menu__button")}
                  key={label}
                  onClick={() => useVibration({ callback: () => handleFunc(func) })}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
          </div>
        )}
    </>
  );
}
