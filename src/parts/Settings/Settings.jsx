import { useContext, useMemo, useState } from "react";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Modal from "../../components/Modal";
import ThemeToggle from "../../components/ThemeToggle";
import MenuItem from "../../components/MenuItem";
import Toggle from "../../interface/Toggle";
import ScaleSelect from "../../components/ScaleSelect";
import Button from "../../interface/Button";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

// helpers
import { encodeBase64 } from "../../helpers/encodeBase64";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Settings.module.scss";
const mc = mapClassesCurried(maps, true);

export default function Category({ className, open, onClose = () => {} }) {
  const { settings, useVibration, toggleVibration, getStorageSize } = useContext(SettingsContext);

  const [exportOpen, setExportOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const storageUsage = useMemo(() => `${getStorageSize()}KB`, [open]);

  // check feature support
  const supportsVibration = useMemo(() => Boolean("vibrate" in navigator), []);

  const classList = useClassList({ defaultClass: "settings", className, maps, string: true });

  /**
   * Clear list storage
   */
  const clearStorage = () => {
    localStorage.setItem("bills__lists", encodeBase64({}));

    setConfirmClearOpen(false);
  };

  return (
    <>
      <Modal className={classList} open={open} onClose={() => onClose()} title="Settings" variant="mobile-full">
        <div className={mc("settings__section")}>
          <h3>Display</h3>

          <ScaleSelect />
        </div>

        {supportsVibration && (
          <div className={mc("settings__section")}>
            <h3>Interactions</h3>

            <Toggle checked={settings.vibration} onChange={() => useVibration({ callback: () => toggleVibration() })}>
              Touch Vibrations
            </Toggle>
          </div>
        )}

        <div className={mc("settings__section")}>
          <h3>Storage</h3>

          <MenuItem label="Usage">{storageUsage}</MenuItem>

          <MenuItem>
            <Button onClick={() => setConfirmClearOpen(true)}>Clear App Data</Button>
          </MenuItem>
        </div>

        <div className={mc("settings__section")}>
          <h3>Theme</h3>

          <ThemeToggle />
        </div>

        <div className={mc("settings__section")}>
          <h3>About</h3>

          <MenuItem label="App Version">{__APP_VERSION__}</MenuItem>
        </div>
      </Modal>

      <ConfirmModal></ConfirmModal>

      <ConfirmModal
        title="Clear storage?"
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        action={clearStorage}
      >
        Are you sure you want to clear list storage?
      </ConfirmModal>
    </>
  );
}
