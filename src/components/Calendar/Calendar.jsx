import { useCallback, useRef, useState } from "react";
import { useLayer } from "react-laag";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import { Calendar as AriaCalendar, Button, Heading, CalendarCell, CalendarGrid } from "react-aria-components";

// styles
import maps from "./Calendar.module.scss";
const mc = mapClassesCurried(maps, true);

export default function Calendar({ className, selectedDate, onChange }) {
  const buttonRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen,
    onOutsideClick: () => setIsOpen(false),
    onDisappear: () => setIsOpen(false),
    auto: true,
    overflowContainer: true,
    triggerOffset: 5,
    containerOffset: 10,
    container: () => buttonRef.current.parentElement,
  });

  const buttonClassList = useClassList(
    { defaultClass: "calendar", className, maps, string: true },
    useCallback(c => selectedDate && c.push("calendar--value"), [selectedDate])
  );
  const menuClassList = useClassList({ defaultClass: "calendar-menu", maps, string: true });

  return (
    <>
      <button
        {...triggerProps}
        type="button"
        className={buttonClassList}
        ref={r => {
          buttonRef.current = r;
          triggerProps.ref(r);

          return r;
        }}
        onClick={() => setIsOpen(o => !o)}
      >
        {selectedDate ? selectedDate?.toLocaleDateString() || "" : "Select a date..."}
      </button>

      {isOpen &&
        renderLayer(
          <div {...layerProps} className={menuClassList}>
            <AriaCalendar className={mc("calendar-menu__calendar")} onChange={onChange}>
              <header className={mc("calendar-menu__header")}>
                <Button slot="previous">◀</Button>
                <Heading />
                <Button slot="next">▶</Button>
              </header>
              <div className={mc("calendar-menu__inner")}>
                <CalendarGrid>
                  {date => <CalendarCell className={mc("calendar-menu__cell")} date={date} />}
                </CalendarGrid>
              </div>
            </AriaCalendar>
          </div>
        )}
    </>
  );
}
