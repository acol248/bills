import { useContext, useState } from "react";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Keypad from "../../components/Keypad";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./RemovePin.module.scss";
import { useNavigate } from "react-router-dom";
const mc = mapClassesCurried(maps, true);

// types
interface Props {
  className?: Element["className"];
}

export default function ManagePin({ className }: Props) {
  const { removeAuthentication } = useContext(SettingsContext);

  const navigate = useNavigate();

  const [activePin, setActivePin] = useState<string | undefined>(undefined);

  const classList = useClassList({ defaultClass: "remove-pin", className, maps, string: true });

  /**
   * Handle pin check and update
   */
  const checkInput = async () => {
    if (!activePin) return;

    if (!(await removeAuthentication(activePin))) return;

    setActivePin(undefined);
    navigate("/settings");
  };

  /**
   * Handle a keypress event from the Keypad component
   *
   * @param code key entered
   */
  const press = (code: string | undefined) => {
    setActivePin((p: string | undefined) => {
      if (code === "backspace" && p && p.length) return p.substring(0, p.length - 1);

      return `${p ?? ""}${code !== "backspace" ? code : ""}`;
    });
  };

  return (
    <div className={classList}>
      <div className={mc("remove-pin__dots")}>
        {activePin?.split("").map((_, index) => (
          <div className={mc("remove-pin__dot")} key={index}></div>
        ))}
      </div>

      <Keypad onChange={press} onConfirm={checkInput} />

      <p className={mc("remove-pin__text")}>Input your current pin</p>
    </div>
  );
}
