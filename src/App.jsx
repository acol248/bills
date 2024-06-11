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
import Calendar from "./components/Calendar";
import FloatingMenu from "./components/FloatingMenu";
import Category from "./components/Category/Category";
import SelectList from "./components/SelectList/SelectList";
import ConfirmModal from "./components/ConfirmModal/ConfirmModal";

// parts
import Settings from "./parts/Settings";

// helpers
import { formatCurrency } from "./helpers/formatCurrency";

// styles
import "./index.css";
import maps from "./App.module.scss";
const mc = mapClassesCurried(maps, true);

export default function App() {
  const _settings = useSettings();
  const _bills = useBills();

  const targetId = useRef(null);
  const itemFormRef = useRef(null);
  const categoryFormRef = useRef(null);

  const previousSelectedList = useRef(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);

  const [deleteItemConfirmOpen, setDeleteItemConfirmOpen] = useState(false);
  const [deleteCategoryConfirmOpen, setDeleteCategoryConfirmOpen] = useState(false);

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
      _bills.updateBill(
        {
          name: formData.name,
          value: parseFloat(formData.value),
          date: selectedDate,
          id: targetId.current,
        },
        previousSelectedList.current,
        selectedList
      );
    } else {
      _bills.addBill({ name: formData.name, value: parseFloat(formData.value), date: selectedDate }, selectedList);
    }

    setIsAddItemOpen(false);
    setItemOpen(false);
  };

  /**
   * Handle add form completion
   *
   * @param {Event} e FormEvent object
   */
  const handleAddCategory = e => {
    e.preventDefault();

    _bills.addList(Object.fromEntries(new FormData(e.target).entries()).name);
    setIsAddCategoryOpen(false);
  };

  /**
   * Handle open edit item, populated
   *
   * @param {string} target
   * @returns
   */
  const handleOpenEdit = target => {
    const { current: form } = itemFormRef;

    if (!form) return;

    const { id, name, value, date, category } = Object.keys(_bills.bills).reduce((a, k) => {
      if (_bills.bills[k].find(({ id }) => id === target))
        return { ..._bills.bills[k].find(({ id }) => id === target), category: k };

      return a;
    }, {});

    form.name.value = name;
    form.value.value = value;
    targetId.current = id;
    setSelectedDate(date);
    previousSelectedList.current = category;
    setSelectedList(category);

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

  /**
   * Trigger confirmation for deletion of category
   *
   * @param {string} name name of target
   */
  const handleRemoveCategory = name => {
    targetId.current = name;
    setDeleteCategoryConfirmOpen(true);
  };

  return (
    <main className={classList}>
      <ThemeWrapper value={_settings.settings.theme}>
        <SettingsContext.Provider value={_settings}>
          <BillsContext.Provider value={_bills}>
            <div className={mc("app__header")}>
              <div className={mc("app__header-inner")}>
                <h2 className={mc("app__total")}>{formatCurrency(Math.round(_bills.total * 100) / 100)}</h2>

                <button
                  className={mc("app__settings-button")}
                  onClick={() => _settings.useVibration({ callback: () => setIsSettingsOpen(true) })}
                >
                  <Icon type="settings" />
                </button>
              </div>
            </div>

            <div className={mc("app__bill-list")}>
              {Boolean(Object.keys(_bills.bills).length > 0) ? (
                Object.keys(_bills.bills).map(k => (
                  <Category
                    className={mc("app__bill-category")}
                    name={k}
                    total={formatCurrency(_bills.bills[k].reduce((t, i) => (t += i.value), 0))}
                    onDelete={handleRemoveCategory}
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
                              onClick={() =>
                                _settings.useVibration({
                                  callback: () => {
                                    targetId.current = id;
                                    setDeleteItemConfirmOpen(true);
                                  },
                                })
                              }
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
                ))
              ) : (
                <p className={mc("app__welcome-message")}>
                  To get started, add a category using the add button at the bottom right of the screen
                </p>
              )}
            </div>

            <FloatingMenu
              buttons={[
                {
                  label: "Add Item",
                  icon: <Icon type="item-add" />,
                  func: () => _settings.useVibration({ callback: () => setIsAddItemOpen(true) }),
                  disabled: Boolean(Object.keys(_bills.bills).length <= 0),
                },
                {
                  label: "Add Category",
                  icon: <Icon type="category-add" />,
                  func: () => _settings.useVibration({ callback: () => setIsAddCategoryOpen(true) }),
                },
              ]}
            />

            <ConfirmModal
              title="Delete item?"
              open={deleteItemConfirmOpen}
              onClose={() => {
                targetId.current = null;
                setDeleteItemConfirmOpen(false);
              }}
              action={() => {
                _bills.removeBill(targetId.current);
                targetId.current = null;
                setDeleteItemConfirmOpen(false);
              }}
            >
              Are you sure you want to delete this item?
            </ConfirmModal>

            <ConfirmModal
              title="Delete category?"
              open={deleteCategoryConfirmOpen}
              onClose={() => {
                targetId.current = null;
                setDeleteCategoryConfirmOpen(false);
              }}
              action={() => {
                _bills.removeList(targetId.current);
                targetId.current = null;
                setDeleteCategoryConfirmOpen(false);
              }}
            >
              Are you sure you want to delete this category?
            </ConfirmModal>

            <Modal
              className={mc("add")}
              open={isAddItemOpen}
              onClose={() => setIsAddItemOpen(false)}
              title="Add Item"
              variant="mobile-bottom"
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

                <div className={mc("add__buttons")}>
                  <Button variant="secondary" type="button" onClick={() => setIsAddItemOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Save</Button>
                </div>
              </form>
            </Modal>

            <Modal
              className={mc("add")}
              open={isAddCategoryOpen}
              onClose={() => setIsAddCategoryOpen(false)}
              title="Add Category"
              variant="mobile-bottom"
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

                <div className={mc("add__buttons")}>
                  <Button variant="secondary" type="button" onClick={() => setIsAddCategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Save</Button>
                </div>
              </form>
            </Modal>

            <Settings open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          </BillsContext.Provider>
        </SettingsContext.Provider>
      </ThemeWrapper>
    </main>
  );
}
