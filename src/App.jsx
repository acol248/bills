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
import MenuItem from "./components/MenuItem";
import FloatingMenu from "./components/FloatingMenu";
import MenuButton from "./components/MenuButton";

// helpers
import { formatCurrency } from "./helpers/formatCurrency";

// styles
import "./index.css";
import maps from "./App.module.scss";
import Category from "./components/Category/Category";
import SelectList from "./components/SelectList/SelectList";
const mc = mapClassesCurried(maps, true);

export default function App() {
  const _settings = useSettings();
  const _bills = useBills();

  const targetId = useRef(null);
  const itemFormRef = useRef(null);
  const categoryFormRef = useRef(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  const classList = useClassList({ defaultClass: "app", maps, string: true });

  /**
   * Handle add form completion
   *
   * @param {Event} e FormEvent object
   */
  const handleAddItem = e => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target).entries());

    if (Object.keys(formData).reduce((bool, key) => (formData[key].length && !bool ? false : true), false)) return;

    if (!selectedList) return;

    if (targetId.current) {
      _bills.updateBill({
        name: formData.name,
        value: parseFloat(formData.value),
        date: selectedDate,
        id: targetId.current,
      });
    } else {
      _bills.addBill({ name: formData.name, value: parseFloat(formData.value), date: selectedDate }, selectedList);
    }

    setIsAddItemOpen(false);
  };

  /**
   * Handle add form completion
   *
   * @param {Event} e FormEvent object
   */
  const handleAddCategory = e => {
    e.preventDefault();

    const { name } = Object.fromEntries(new FormData(e.target).entries());

    _bills.addList(name);

    setIsAddCategoryOpen(false);
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

    setIsAddItemOpen(true);
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
  const handleCategoryModalTransitionEnd = () => {
    if (isAddCategoryOpen) return;

    categoryFormRef.current.reset();
  };

  /**
   * Reset form on close
   */
  const handleItemModalTransitionEnd = () => {
    if (isAddItemOpen) return;

    itemFormRef.current.reset();
    targetId.current = null;
    setSelectedDate(null);
    setSelectedList(null);
  };

  return (
    <main className={classList}>
      <ThemeWrapper value={_settings.settings.theme}>
        <SettingsContext.Provider value={_settings}>
          <BillsContext.Provider value={_bills}>
            <div className={mc("app__header")}>
              <h2 className={mc("app__total")}>{formatCurrency(Math.round(_bills.total * 100) / 100)}</h2>

              <button
                className={mc("app__settings-button")}
                onClick={() => _settings.useVibration({ callback: () => setIsSettingsOpen(true) })}
              >
                <Icon type="settings" />
              </button>
            </div>

            <div className={mc("app__bill-list")}>
              {Boolean(_bills.bills) &&
                Object.keys(_bills.bills).map(k => (
                  <Category
                    className={mc("app__bill-category")}
                    name={k}
                    total={formatCurrency(_bills.bills[k].reduce((t, i) => (t += i.value), 0))}
                    key={k}
                  >
                    {Boolean(_bills.bills[k].length > 0) ? (
                      _bills.bills[k].map(({ id, name, value, date }) => (
                        <ListItem
                          className={mc("app__bill-item")}
                          name={name}
                          value={formatCurrency(value)}
                          date={date}
                          open={itemOpen === id}
                          onToggle={() => _settings.useVibration({ callback: () => handleOpenItem(id) })}
                          key={id + name}
                        >
                          <div className={mc("app__bill-options")}>
                            <Button
                              className={mc("app__bill-button")}
                              onClick={() => _settings.useVibration({ callback: () => handleOpenEdit(id) })}
                            >
                              Edit
                            </Button>
                            <Button
                              className={mc("app__bill-button")}
                              onClick={() => _settings.useVibration({ callback: () => _bills.removeBill(id) })}
                            >
                              Delete
                            </Button>
                          </div>
                        </ListItem>
                      ))
                    ) : (
                      <p className={mc("app__category-empty")}>Empty</p>
                    )}
                  </Category>
                ))}
            </div>

            <FloatingMenu
              buttons={[
                {
                  label: "Add Item",
                  icon: <Icon type="item-add" />,
                  func: () => _settings.useVibration({ callback: () => setIsAddItemOpen(true) }),
                },
                {
                  label: "Add Category",
                  icon: <Icon type="category-add" />,
                  func: () => _settings.useVibration({ callback: () => setIsAddCategoryOpen(true) }),
                },
              ]}
            />

            <Modal
              className={mc("add")}
              open={isAddItemOpen}
              onClose={() => setIsAddItemOpen(false)}
              title="Add Item"
              variant="mobile-full"
              onTransitionEnd={handleItemModalTransitionEnd}
            >
              <form
                className={mc("add__form")}
                onSubmit={e => _settings.useVibration({ callback: () => handleAddItem(e) })}
                autoComplete="off"
                ref={itemFormRef}
              >
                <div className={mc("add__inputs")}>
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

                  <label className={mc("add__label")}>
                    <span>Select category</span>
                    <SelectList list={Object.keys(_bills.bills)} selectedList={selectedList} onSelect={setSelectedList}>
                      No category selected
                    </SelectList>
                  </label>
                </div>

                <Button>Save</Button>
              </form>
            </Modal>

            <Modal
              className={mc("add")}
              open={isAddCategoryOpen}
              onClose={() => setIsAddCategoryOpen(false)}
              title="Add Category"
              variant="mobile-full"
              onTransitionEnd={handleCategoryModalTransitionEnd}
            >
              <form
                className={mc("add__form")}
                onSubmit={e => _settings.useVibration({ callback: () => handleAddCategory(e) })}
                autoComplete="off"
                ref={categoryFormRef}
              >
                <div className={mc("add__inputs")}>
                  <Input name="name" placeholder="Category name">
                    Name
                  </Input>
                </div>

                <Button>Save</Button>
              </form>
            </Modal>

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

                <Toggle
                  checked={_settings.settings.vibration}
                  onChange={() => _settings.useVibration({ callback: () => _settings.toggleVibration() })}
                >
                  Touch Vibrations
                </Toggle>
              </div>

              <div className={mc("settings__section")}>
                <h3>Theme</h3>

                <ThemeToggle />
              </div>

              <div className={mc("settings__section")}>
                <h3>About</h3>

                <MenuItem label="App Version" content={__APP_VERSION__} />
              </div>
            </Modal>
          </BillsContext.Provider>
        </SettingsContext.Provider>
      </ThemeWrapper>
    </main>
  );
}
