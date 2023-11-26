import { useRef, useState } from "react";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// hooks
import useBills, { BillsContext } from "./hooks/useBills";

// components
import Modal from "./components/Modal/Modal";
import ThemeWrapper from "./components/ThemeWrapper";
import Button from "./interface/Button";
import Input from "./interface/Input";

// styles
import "./index.css";
import maps from "./App.module.scss";
import ListItem from "./components/ListItem/ListItem";
const mc = mapClassesCurried(maps, true);

export default function App() {
  const _list = useBills();

  const formRef = useRef(null);

  const theme = document.cookie || "dark";

  const [isOpen, setIsOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);

  const classList = useClassList({ defaultClass: "app", maps, string: true });

  const handleAdd = e => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target).entries());

    if (Object.keys(formData).reduce((bool, key) => (formData[key].length && !bool ? false : true), false)) return;

    _list.addBill(formData);
    setIsOpen(false);
  };

  const handleModalTransitionEnd = () => {
    if (isOpen) return;

    formRef.current.reset();
  };

  return (
    <main className={classList}>
      <BillsContext.Provider value={_list}>
        <ThemeWrapper value={String(theme)}>
          <Button onClick={() => setIsOpen(true)}>Add</Button>

          <div className={mc("app__bill-list")}>
            {Boolean(_list.bills.length > 0) &&
              _list.bills.map(({ id, name, value }) => (
                <ListItem
                  className={mc("app__bill-item")}
                  name={name}
                  value={value}
                  open={itemOpen === name}
                  onToggle={() =>
                    setItemOpen(n => {
                      if (n === name) return null;

                      return name;
                    })
                  }
                  key={name + value}
                >
                  <div className={mc("app__bill-options")}>
                    <button className={mc("app__bill-button")}>Edit</button>
                    <button className={mc("app__bill-button")} onClick={() => _list.removeBill(id)}>
                      Delete
                    </button>
                  </div>
                </ListItem>
              ))}
          </div>

          <Modal
            className={mc("app__add-modal")}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            title="Add"
            variant="mobile-full"
            onTransitionEnd={handleModalTransitionEnd}
          >
            <form className={mc("app__add-form")} onSubmit={handleAdd} ref={formRef}>
              <Input name="name" placeholder="Item name">
                Name
              </Input>
              <Input name="value" placeholder="Item value">
                Value
              </Input>

              <Button>Save</Button>
            </form>
          </Modal>
        </ThemeWrapper>
      </BillsContext.Provider>
    </main>
  );
}
