import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// hooks
import { SettingsContext } from "../../hooks/useSettings";

// components
import Keypad from "../../components/Keypad";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Authentication.module.scss";
const mc = mapClassesCurried(maps, true);

export default function Authentication() {
  const { authCheck, verifyAuthentication } = useContext(SettingsContext);

  const [passCode, setPassCode] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const classList = useClassList({ defaultClass: "auth", maps, string: true });

  /**
   * Handle a keypress event from the Keypad component
   *
   * @param code key entered
   */
  const press = (code: string | undefined) => {
    setPassCode((p: string | undefined) => {
      if (code === "backspace" && p) return p.substring(0, p.length - 1);

      return `${p ?? ""}${code !== "backspace" ? code : ""}`;
    });
  };

  return (
    <motion.div
      className={classList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.125, ease: "easeInOut" }}
    >
      {authCheck && (
        <>
          <div className={mc("auth__dots")}>
            {passCode?.split("").map((_, index) => (
              <div className={mc("auth__dot")} key={index}></div>
            ))}
          </div>

          <Keypad
            className={mc("auth__keypad")}
            onChange={press}
            onConfirm={() => verifyAuthentication(passCode).then(() => navigate("/up-coming", { replace: true }))}
          />
        </>
      )}
    </motion.div>
  );
}
