import { useCallback, useState } from "react";
import { Calendar as AriaCalendar, Button, Heading, CalendarCell, CalendarGrid } from "react-aria-components";

// components
import Modal from "../Modal";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Calendar.module.scss";
const mc = mapClassesCurried(maps, true);

export default function Calendar({ className, selectedDate, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const buttonClassList = useClassList(
    { defaultClass: "calendar", className, maps, string: true },
    useCallback(c => selectedDate && c.push("calendar--value"), [selectedDate])
  );
  const menuClassList = useClassList({ defaultClass: "calendar-menu", maps, string: true });

  /**
   * Close menu and trigger params change when calendar change
   *
   * @param {object} v calendar value
   */
  const handleOnChange = v => {
    onChange(v);
    setTimeout(() => setIsOpen(false), 0);
  };

  return (
    <>
      <button type="button" className={buttonClassList} onClick={() => setIsOpen(true)} aria-label="open date select">
        {selectedDate ? new Date(selectedDate)?.toLocaleDateString() || "" : "No date selected"}
      </button>

      <Modal className={menuClassList} title="Calendar" open={isOpen} onClose={() => setIsOpen(false)}>
        <AriaCalendar className={mc("calendar-menu__calendar")} onChange={handleOnChange}>
          <header className={mc("calendar-menu__header")}>
            <Button slot="previous">
              <svg viewBox="0 -960 960 960">
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </svg>
            </Button>
            <Heading />
            <Button slot="next">
              <svg viewBox="0 -960 960 960">
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </svg>
            </Button>
          </header>
          <div className={mc("calendar-menu__inner")}>
            <CalendarGrid>{date => <CalendarCell className={mc("calendar-menu__cell")} date={date} />}</CalendarGrid>
          </div>
        </AriaCalendar>
      </Modal>
    </>
  );
}
