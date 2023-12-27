import { useCallback, useRef, useState } from "react";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// hooks
import useBills, { BillsContext } from "./hooks/useBills";
import useSettings, { SettingsContext } from "./hooks/useSettings";

// components
import Modal from "./components/Modal";
import ThemeWrapper from "./components/ThemeWrapper";
import Button from "./interface/Button";
import Input from "./interface/Input";
import ListItem from "./components/ListItem";
import Icon from "./components/Icon";
import ThemeToggle from "./components/ThemeToggle";
import ScaleSelect from "./components/ScaleSelect";
import Toggle from "./interface/Toggle";
import Calendar from "./components/Calendar";

// styles
import "./index.css";
import maps from "./App.module.scss";
import BottomModal from "./components/BottomModal/BottomModal";
const mc = mapClassesCurried(maps, true);

export default function App() {
  const _settings = useSettings();
  const _bills = useBills();

  const targetId = useRef(null);
  const formRef = useRef(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);

  const classList = useClassList({ defaultClass: "app", maps, string: true });

  /**
   * Handle add form completion
   *
   * @param {Event} e FormEvent object
   */
  const handleAdd = e => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target).entries());

    if (Object.keys(formData).reduce((bool, key) => (formData[key].length && !bool ? false : true), false)) return;

    if (targetId.current) {
      _bills.updateBill({
        name: formData.name,
        value: parseFloat(formData.value),
        date: selectedDate,
        id: targetId.current,
      });
    } else {
      _bills.addBill({ name: formData.name, value: parseFloat(formData.value), date: selectedDate });
    }

    setIsAddOpen(false);
  };

  /**
   * Handle open edit item, populated
   *
   * @param {string} target
   * @returns
   */
  const handleOpenEdit = target => {
    const { current: form } = formRef;

    if (!form) return;

    const { id, name, value, date } = _bills.bills.find(({ id }) => id == target);

    form.name.value = name;
    form.value.value = value;
    targetId.current = id;
    setSelectedDate(date);

    setIsAddOpen(true);
  };

  /**
   * Handle open list item
   *
   * @param {string} name name identifier
   */
  const handleOpenItem = useCallback(
    name => {
      if (itemOpen && itemOpen !== name) {
        setItemOpen(null);

        return setTimeout(() => setItemOpen(name), 50);
      }

      setItemOpen(n => {
        if (n === name) return null;

        return name;
      });
    },
    [itemOpen]
  );

  /**
   * Reset form on close
   */
  const handleModalTransitionEnd = () => {
    if (isAddOpen) return;

    formRef.current.reset();
    targetId.current = null;
    setSelectedDate(null);
  };

  return (
    <main className={classList}>
      <ThemeWrapper value={_settings.settings.theme}>
        <SettingsContext.Provider value={_settings}>
          <BillsContext.Provider value={_bills}>
            <div className={mc("app__header")}>
              <h2 className={mc("app__total")}>£{Math.round(_bills.total * 100) / 100}</h2>

              <Button
                className={mc("app__settings-button")}
                variant="tertiary"
                icon={<Icon type="settings" />}
                onClick={() => _settings.useVibration(8, () => setIsSettingsOpen(true))}
              />
            </div>

            <div className={mc("app__bill-list")}>
              {Boolean(_bills.bills.length > 0) &&
                _bills.bills.map(({ id, name, value, date }) => (
                  <ListItem
                    className={mc("app__bill-item")}
                    name={name}
                    value={value}
                    date={date}
                    open={itemOpen === id}
                    onToggle={() => _settings.useVibration(8, () => handleOpenItem(id))}
                    key={id + name}
                  >
                    <div className={mc("app__bill-options")}>
                      <Button
                        className={mc("app__bill-button")}
                        onClick={() => _settings.useVibration(8, () => handleOpenEdit(id))}
                      >
                        Edit
                      </Button>
                      <Button
                        className={mc("app__bill-button")}
                        onClick={() => _settings.useVibration(8, () => _bills.removeBill(id))}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListItem>
                ))}
            </div>

            <Button
              className={mc("app__add-button")}
              icon={<Icon type="add" />}
              onClick={() => _settings.useVibration(8, () => setIsAddOpen(true))}
            />

            <BottomModal
              className={mc("add")}
              open={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              title="Add"
              variant="mobile-bottom"
              onTransitionEnd={handleModalTransitionEnd}
              id="dialogModalAdd"
            >
              <form
                className={mc("add__form")}
                onSubmit={e => _settings.useVibration(8, () => handleAdd(e))}
                ref={formRef}
              >
                <Input name="name" placeholder="Item name">
                  Name
                </Input>
                <Input name="value" pattern="^-?[\d,]+(?:\.\d{2})?$" placeholder="Item value">
                  Value
                </Input>

                <label className={mc("add__label")}>
                  <span>Select billing date</span>
                  <Calendar
                    selectedDate={selectedDate}
                    onChange={({ year, month, day }) => setSelectedDate(new Date(`${year}/${month}/${day}`))}
                  />
                </label>

                <Button className={mc("add__submit")}>Save</Button>
              </form>
            </BottomModal>

            <Modal
              className={mc("settings")}
              open={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              title="Settings"
              variant="mobile-full"
            >
              <div className={mc("settings__section")}>
                <h3>Display</h3>

                <ScaleSelect />
              </div>

              <div className={mc("settings__section")}>
                <h3>Interactions</h3>

                <Toggle checked={_settings.settings.vibration === "true"} onChange={() => _settings.toggleVibration()}>
                  Touch Vibrations
                </Toggle>
              </div>

              <div className={mc("settings__section")}>
                <h3>Theme</h3>

                <ThemeToggle />
              </div>

              <div className={mc("settings__section")}>
                <h3>About</h3>
              </div>
            </Modal>
          </BillsContext.Provider>
        </SettingsContext.Provider>
      </ThemeWrapper>
    </main>
  );
}
