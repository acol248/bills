import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Keypad from "../../components/Keypad";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./RemovePin.module.scss";
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
    <motion.div
      className={classList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.125, ease: "easeInOut" }}
    >
      <Link className={mc("remove-pin__back")} to="/settings">
        <svg viewBox="0 -960 960 960">
          <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
        </svg>
        Back
      </Link>

      <div className={mc("remove-pin__dots")}>
        {activePin?.split("").map((_, index) => (
          <div className={mc("remove-pin__dot")} key={index}></div>
        ))}
      </div>

      <Keypad onChange={press} onConfirm={checkInput} />

      <p className={mc("remove-pin__text")}>Input your current pin</p>
    </motion.div>
  );
}
