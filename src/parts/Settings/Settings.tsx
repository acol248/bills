import { ReactEventHandler, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// hooks
import { SettingsContext } from "../../hooks/useSettings";
import { DataContext } from "../../hooks/useData";

// components
import Slider from "../../components/Slider";
import Toggle from "../../interface/Toggle";
import Button from "../../interface/Button";
import Input from "../../interface/Input";
import Select from "../../interface/Select";
import BottomModal from "../../components/BottomModal";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Settings.module.scss";

const mc = mapClassesCurried(maps, true);

const accountTypes = [
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
  { value: "savings", label: "Savings" },
  { value: "checking", label: "Checking" },
];

export default function Settings() {
  const {
    theme,
    vibrations,
    pst,
    scale,
    forceScale,
    authCheck,
    toggleTheme,
    togglePST,
    toggleForceScale,
    updateScale,
    toggleVibrations,
    vibrate,
  } = useContext(SettingsContext);

  const { accounts, accountBrands, addAccount } = useContext(DataContext);

  const navigate = useNavigate();

  const [accOpen, setAccOpen] = useState<boolean>(false);

  const classList = useClassList({ defaultClass: "settings", maps, string: true });

  /**
   * Add account submission from form
   *
   * @param e event object
   */
  const onAddAccount: ReactEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    const { accountName, accountType, accountBrand } = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    addAccount({
      name: String(accountName),
      type: accountType as "credit" | "debit" | "savings" | "checking",
      brand: String(accountBrand),
    });

    setAccOpen(false);
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
        <h3>Accounts</h3>

        {accounts.length > 0 ? accounts.map(({ id, name }) => <button key={id}>{name}</button>) : <p>No accounts</p>}

        <button onClick={() => vibrate({ callback: () => setAccOpen(true) })}>Add Account</button>
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

      <div className={mc("settings__section")}>
        <h3>About</h3>

        <div className={mc("settings__readonly")}>
          <p>Version</p>
          {__APP_VERSION__}
        </div>
      </div>

      <BottomModal className={mc("account")} title="Add Account" open={accOpen} onClose={() => setAccOpen(false)}>
        <form className={mc("account__form")} onSubmit={onAddAccount}>
          <Input label="Account Nickname" name="accountName" type="text" placeholder="Name" />
          <Select label="Account Types" items={accountTypes} />
          <Select label="Account Brand" items={accountBrands} />

          <Button>Add Account</Button>
        </form>
      </BottomModal>
    </motion.div>
  );
}
