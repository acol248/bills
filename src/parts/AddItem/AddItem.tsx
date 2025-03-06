import { FormEvent, useContext, useEffect, useMemo, useRef, useState } from "react";
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
import Select from "../../interface/Select";

export default function AddItem() {
  const { vibrate } = useContext(SettingsContext);
  const { accounts, items, currentlyEditing, addItemOpen, setCurrentlyEditing, setAddItemOpen, addItem, editItem } =
    useContext(DataContext);

  const addFormRef = useRef<HTMLFormElement | null>(null);

  const [date, setDate] = useState<DateValue>();

  const classList = useClassList({
    defaultClass: "add-item",
    maps,
    string: true,
  }) as string;

  const currentItem = useMemo(() => items.find(({ id }) => id === currentlyEditing), [currentlyEditing]);

  /**
   * Submit add form
   *
   * @param e form submission event object
   */
  const submitForm = (e: FormEvent) => {
    e.preventDefault();

    vibrate();

    if (!date && !currentItem?.date) return;

    const { itemName, value, account } = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    if (currentlyEditing) {
      editItem({
        id: currentlyEditing,
        name: String(itemName),
        value: parseFloat(String(value)),
        date: new Date(String(date ?? currentItem?.date)) as any,
        account: account ? String(account) : undefined,
      });
    } else {
      addItem({
        id: uuidv4(),
        name: String(itemName),
        value: parseFloat(String(value)),
        date: new Date(String(date ?? currentItem?.date)) as any,
        account: account ? String(account) : undefined,
      });
    }

    setAddItemOpen(false);
  };

  // clear currently editing on close
  useEffect(() => {
    if (addItemOpen) return;

    setCurrentlyEditing(undefined);
  }, [addItemOpen]);

  return (
    <BottomModal
      className={classList}
      title="Add Item"
      open={addItemOpen}
      onClose={() => vibrate({ callback: () => setAddItemOpen(false) })}
      onTransitionEnd={() => !addItemOpen && setDate(undefined)}
    >
      <form className={mc("add-item__form")} onSubmit={submitForm} ref={addFormRef}>
        <Input label="Name" name="itemName" defaultValue={currentItem?.name} />

        <Input label="Value" name="value" type="number" step={0.01} defaultValue={currentItem?.value} />

        <Calendar selectedDate={date ?? currentItem?.date} onChange={e => setDate(e)} />

        {accounts && accounts?.length > 0 && (
          <Select
            label="Associated Account"
            name="account"
            placeholder="Select Associated Account"
            items={accounts.map(({ id, name }) => ({ label: name, value: id }))}
            defaultValue={currentItem?.account}
          />
        )}

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
