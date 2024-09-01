// components
import Keypad from "../../components/Keypad";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Authentication.module.scss";
import { useContext, useState } from "react";
import { SettingsContext } from "../../hooks/useSettings";
import { useNavigate } from "react-router-dom";
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
    <div className={classList}>
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
    </div>
  );
}
