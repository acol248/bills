import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Slider from "../../components/Slider";
import Toggle from "../../interface/Toggle";
import EditableList from "../../components/EditableList";
import Modal from "../../components/Modal";
import Input from "../../interface/Input";
import Button from "../../interface/Button";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Settings.module.scss";
const mc = mapClassesCurried(maps, true);

export default function Settings() {
  const {
    theme,
    vibrations,
    pst,
    scale,
    forceScale,
    authCheck,
    incomeItems,
    toggleTheme,
    togglePST,
    toggleForceScale,
    updateScale,
    toggleVibrations,
    vibrate,
    addIncomeItem,
    removeIncomeItem,
  } = useContext(SettingsContext);

  const navigate = useNavigate();

  const [incomeOpen, setIncomeOpen] = useState(false);

  const classList = useClassList({ defaultClass: "settings", maps, string: true });

  /**
   * Add a new income item
   *
   * @param e form submission event object
   */
  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();

    const { incomeName, incomeValue } = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    if (!incomeName || !incomeValue) return;

    addIncomeItem({ name: incomeName as string, income: parseFloat(incomeValue as string) });
    setIncomeOpen(false);
  };

  return (
    <motion.div
      className={classList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.125, ease: "easeInOut" }}
    >
      <h1>Settings</h1>

      <div className={mc("settings__section")}>
        <h3>Income</h3>

        <EditableList
          items={(incomeItems || []).map(({ id, name, income }) => ({ id, name, value: income }))}
          onAdd={() => setIncomeOpen(true)}
          onRemove={removeIncomeItem}
        />
      </div>

      <div className={mc("settings__section")}>
        <h3>Appearance</h3>

        <Toggle
          className={mc("settings__toggle")}
          checked={theme === "dark"}
          disabled={pst}
          onChange={() => vibrate({ callback: () => toggleTheme() })}
        >
          Dark Mode
        </Toggle>

        <Toggle
          className={mc("settings__toggle")}
          checked={pst}
          onChange={() => vibrate({ callback: () => togglePST() })}
        >
          Prefer System Theme
        </Toggle>
      </div>

      <div className={mc("settings__section")}>
        <h3>Accessibility</h3>

        <Toggle
          className={mc("settings__toggle")}
          checked={vibrations}
          onChange={() => vibrate({ callback: () => toggleVibrations() })}
        >
          Use Vibrations
        </Toggle>

        <div className={mc("settings__fake-item")}>
          <Toggle
            className={mc("settings__toggle")}
            checked={forceScale}
            onChange={() => vibrate({ callback: () => toggleForceScale() })}
          >
            Force Increased Text Scale
          </Toggle>

          {forceScale && (
            <Slider
              className={mc("settings__scale")}
              step={0.2}
              max={1.4}
              min={0.6}
              defaultValue={[scale]}
              onValueChange={([s]) => vibrate({ callback: () => updateScale(s) })}
            />
          )}
        </div>
      </div>

      <div className={mc("settings__section")}>
        <h3>Security</h3>

        <button onClick={() => vibrate({ callback: () => navigate("/settings/manage-pin") })}>
          {authCheck ? "Change Pin" : "Create Pin"}
        </button>
        {authCheck && (
          <button onClick={() => vibrate({ callback: () => navigate("/settings/remove-pin") })}>Remove</button>
        )}
      </div>

      <Modal className={mc("add-income")} title="Add Income" open={incomeOpen} onClose={() => setIncomeOpen(false)}>
        <form onSubmit={handleAddIncome}>
          <Input name="incomeName">Name</Input>
          <Input name="incomeValue" type="number">
            Income
          </Input>

          <div className={mc("add-income__buttons")}>
            <Button type="button" onClick={() => setIncomeOpen(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
