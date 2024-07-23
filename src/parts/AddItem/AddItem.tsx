import { FormEvent, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// hooks
import { DataContext } from "../../hooks/useData";

// components
import BottomModal from "../../components/BottomModal";
import Button from "../../interface/Button";
import Input from "../../interface/Input";
import Calendar from "../../components/Calendar";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./AddItem.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

export default function AddItem() {
  const { addItemOpen, setAddItemOpen, addItem } = useContext(DataContext);

  const [date, setDate] = useState<string>("");

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

    if (!date) return;

    const { itemName, value } = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );

    addItem({
      id: uuidv4(),
      name: String(itemName),
      value: parseFloat(String(value)),
      date,
    });
  };

  return (
    <BottomModal
      className={classList}
      title="Add Item"
      open={addItemOpen}
      onClose={() => setAddItemOpen(false)}
    >
      <form className={mc('add-item__form')} onSubmit={submitForm}>
        <Input name="itemName">Name</Input>

        <Input name="value" type="number">
          Value
        </Input>

        <Calendar selectedDate={date} onChange={(e) => console.log(e)} />

        <div className={mc("add-item__buttons")}>
          <Button type="button" onClick={() => setAddItemOpen(false)}>
            Cancel
          </Button>
          <Button>Add</Button>
        </div>
      </form>
    </BottomModal>
  );
}
