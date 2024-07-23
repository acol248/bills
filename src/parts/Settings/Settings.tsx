import useClassList from "@blocdigital/useclasslist";
import Toggle from "../../interface/Toggle";
import { useContext } from "react";
import { SettingsContext } from "../../hooks/useSettings";

export default function Settings() {
  const { theme, toggleTheme } = useContext(SettingsContext);

  const classList = useClassList({ defaultClass: "settings" }) as string;

  return (
    <div className={classList}>
      <Toggle checked={theme === "dark"} onChange={() => toggleTheme()}>
        Dark Mode
      </Toggle>
    </div>
  );
}
