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
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";

// styles
import "./index.css";
import maps from "./App.module.scss";
const mc = mapClassesCurried(maps, true);

export default function App() {
  const _settings = useSettings();
  const _bills = useBills();

  const formRef = useRef(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);

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

    _bills.addBill(formData);
    setIsAddOpen(false);
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
    if (isSettingsOpen) return;

    formRef.current.reset();
  };

  return (
    <main className={classList}>
      <ThemeWrapper value={_settings.settings.theme}>
        <SettingsContext.Provider value={_settings}>
          <BillsContext.Provider value={_bills}>
            <div className={mc("app__header")}>
              <h2 className={mc("app__total")}>£{_bills.total}</h2>

              <Button
                className={mc("app__settings-button")}
                variant="tertiary"
                icon={<Icon type="settings" />}
                onClick={() => setIsSettingsOpen(true)}
              />
            </div>

            <div className={mc("app__bill-list")}>
              {Boolean(_bills.bills.length > 0) &&
                _bills.bills.map(({ id, name, value }) => (
                  <ListItem
                    className={mc("app__bill-item")}
                    name={name}
                    value={value}
                    open={itemOpen === name}
                    onToggle={() => handleOpenItem(name)}
                    key={name + value}
                  >
                    <div className={mc("app__bill-options")}>
                      <Button className={mc("app__bill-button")} disabled={true}>
                        Edit
                      </Button>
                      <Button className={mc("app__bill-button")} onClick={() => _bills.removeBill(id)}>
                        Delete
                      </Button>
                    </div>
                  </ListItem>
                ))}
            </div>

            <Button className={mc("app__add-button")} icon={<Icon type="add" />} onClick={() => setIsAddOpen(true)} />

            <Modal
              className={mc("app__add-modal")}
              open={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              title="Add"
              variant="mobile-bottom"
              onTransitionEnd={handleModalTransitionEnd}
            >
              <form className={mc("app__add-form")} onSubmit={handleAdd} ref={formRef}>
                <Input name="name" placeholder="Item name">
                  Name
                </Input>
                <Input name="value" type="number" placeholder="Item value">
                  Value
                </Input>

                <Button className={mc("app__submit")}>Save</Button>
              </form>
            </Modal>

            <Modal
              className={mc("app__add-modal")}
              open={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              title="Settings"
              variant="mobile-full"
            >
              <ThemeToggle />
            </Modal>
          </BillsContext.Provider>
        </SettingsContext.Provider>
      </ThemeWrapper>
    </main>
  );
}
