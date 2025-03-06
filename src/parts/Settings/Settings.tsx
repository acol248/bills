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

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Settings.module.scss";
import Modal from "../../components/Modal";

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
    privacyMode,
    toggleTheme,
    togglePST,
    toggleForceScale,
    updateScale,
    toggleVibrations,
    togglePrivacyMode,
    vibrate,
  } = useContext(SettingsContext);

  const { accounts, accountBrands, addAccount, removeAccount } = useContext(DataContext);

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

    if (!accountName || !accountType || !accountBrand) return;

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

        {accounts.length > 0 &&
          accounts.map(({ id, name, type }) => (
            <div className={mc("settings__readonly")} key={id}>
              <p>{name}</p>
              {type}

              <button className={mc('settings__remove')} onClick={() => removeAccount(id)}>
                <svg viewBox="0 -960 960 960">
                  <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
                </svg>
              </button>
            </div>
          ))}

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

        <Toggle
          className={mc("settings__toggle")}
          checked={privacyMode}
          onChange={() => vibrate({ callback: () => togglePrivacyMode() })}
        >
          Privacy Mode
        </Toggle>
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

      <Modal className={mc("account")} title="Add Account" open={accOpen} onClose={() => setAccOpen(false)}>
        <form className={mc("account__form")} onSubmit={onAddAccount}>
          <Input label="Account Nickname" name="accountName" type="text" placeholder="Name" />
          <Select label="Account Types" name="accountType" items={accountTypes} placeholder="Select Account Type" />
          <Select label="Account Branding" name="accountBrand" items={accountBrands} placeholder="Select Branding" />

          <Button className={mc("account__submit")}>Add Account</Button>
        </form>
      </Modal>
    </motion.div>
  );
}
