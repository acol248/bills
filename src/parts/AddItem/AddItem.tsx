import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// hooks
import { DataContext } from "../../hooks/useData";
import { SettingsContext } from "../../hooks/useSettings";

// components
import BottomModal from "../../components/BottomModal";
import Button from "../../interface/Button";
import Calendar from "../../components/Calendar";
import Input from "../../interface/Input";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./AddItem.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

// types
import type { DateValue } from "react-aria-components";

export default function AddItem() {
  const { vibrate } = useContext(SettingsContext);
  const { items, currentlyEditing, addItemOpen, setCurrentlyEditing, setAddItemOpen, addItem, editItem } =
    useContext(DataContext);

  const addFormRef = useRef<HTMLFormElement | null>(null);

  const [date, setDate] = useState<DateValue>();

  const classList = useClassList({
    defaultClass: "add-item",
    maps,
    string: true,
  }) as string;

  /**
   * Submit add form
   *
   * @param e form submission event object
   */
  const submitForm = (e: FormEvent) => {
    e.preventDefault();

    vibrate();

    if (!date) return;

    const { itemName, value } = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    if (currentlyEditing) {
      editItem({
        id: currentlyEditing,
        name: String(itemName),
        value: parseFloat(String(value)),
        date: new Date(String(date)),
      });
    } else {
      addItem({
        id: uuidv4(),
        name: String(itemName),
        value: parseFloat(String(value)),
        date: new Date(String(date)),
      });
    }

    setDate(undefined);
    setAddItemOpen(false);
  };

  // clear currently editing on close
  useEffect(() => {
    if (addItemOpen) return;

    setCurrentlyEditing(undefined);
  }, [addItemOpen]);

  // populate on edit
  useEffect(() => {
    if (!addItemOpen || !currentlyEditing) return;

    setTimeout(() => {
      const { current: form } = addFormRef;

      if (!form) return;

      const ce = items.find(({ id }) => id === currentlyEditing);

      if (!ce) return;

      form.itemName.value = ce.name;
      form.value.value = ce.value;

      setDate(ce.date as any);
    }, 0);
  }, [currentlyEditing, addItemOpen]);

  return (
    <BottomModal
      className={classList}
      title="Add Item"
      open={addItemOpen}
      onClose={() => vibrate({ callback: () => setAddItemOpen(false) })}
      onTransitionEnd={() => !addItemOpen && setDate(undefined)}
    >
      <form className={mc("add-item__form")} onSubmit={submitForm} ref={addFormRef}>
        <Input name="itemName">Name</Input>

        <Input name="value" type="number" step={0.01}>
          Value
        </Input>

        <Calendar selectedDate={date} onChange={e => setDate(e)} />

        <div className={mc("add-item__buttons")}>
          <Button type="button" onClick={() => vibrate({ callback: () => setAddItemOpen(false) })}>
            Cancel
          </Button>
          <Button>Add</Button>
        </div>
      </form>
    </BottomModal>
  );
}
