import { useCallback, useContext, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// hooks
import { DataContext } from "../../hooks/useData";

// styles
import useLocalStorage from "@blocdigital/uselocalstorage";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./BaseNavigation.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

// assets
import { SettingsContext } from "../../hooks/useSettings";
import { bufferToString } from "../../helpers/format";

// types
interface IBaseNavigation {
  className?: HTMLElement["className"];
}

export default function BaseNavigation({ className }: IBaseNavigation) {
  const storage = useLocalStorage("local");
  const session = useLocalStorage("session");
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { verifyAuthentication, deAuthenticate, vibrate } = useContext(SettingsContext);
  const { setAddItemOpen } = useContext(DataContext);

  const isIos = useMemo(() => {
    return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
      navigator.platform
    );
  }, []);

  const validPath = useMemo(() => pathname === "/up-coming", [pathname]);

  const classList = useClassList(
    {
      defaultClass: "base-nav",
      className,
      maps,
      string: true,
    },
    useCallback(
      (_c: string[]) => {
        pathname === "/" && _c.push("base-nav--hide");
        isIos && _c.push("base-nav--ios");
      },
      [pathname]
    )
  ) as string;

  // check authentication
  useEffect(() => {
    if (!storage || !session) return;

    (async () => {
      const hash = storage.get("check");
      const token = session.get("check");

      if (!hash) {
        verifyAuthentication(token as string);
        navigate("/up-coming", { replace: true });

        return;
      }

      const encoded = new TextEncoder().encode(hash as string);
      const compare = await window.crypto.subtle.digest("sha-256", encoded);

      if (bufferToString(compare) !== token) {
        deAuthenticate();
        navigate("/", { replace: true });

        return;
      }

      if (pathname === "/") navigate("/up-coming", { replace: true });
    })();
  }, [storage, session]);

  return (
    <nav className={classList}>
      <Link
        className={`${mc("base-nav__link")}${pathname === "/up-coming" ? ` ${mc("base-nav__link--active")}` : ""}`}
        aria-label="goto upcoming items"
        to="/up-coming"
        onClick={() => vibrate()}
      >
        <svg viewBox="0 -960 960 960">
          <path d="m787-145 28-28-75-75v-112h-40v128l87 87Zm-587 25q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Z" />
        </svg>
      </Link>

      <button
        className={mc("base-nav__button")}
        onClick={() => vibrate({ callback: () => setAddItemOpen(true) })}
        aria-label="open add item"
        disabled={!validPath}
      >
        <svg viewBox="0 -960 960 960">
          <path d="M438.09-278.09h83.82v-160h160v-83.82h-160v-160h-83.82v160h-160v83.82h160v160ZM480-71.87q-84.91 0-159.34-32.12-74.44-32.12-129.5-87.17-55.05-55.06-87.17-129.5Q71.87-395.09 71.87-480t32.12-159.34q32.12-74.44 87.17-129.5 55.06-55.05 129.5-87.17 74.43-32.12 159.34-32.12t159.34 32.12q74.44 32.12 129.5 87.17 55.05 55.06 87.17 129.5 32.12 74.43 32.12 159.34t-32.12 159.34q-32.12 74.44-87.17 129.5-55.06 55.05-129.5 87.17Q564.91-71.87 480-71.87Zm0-91q133.04 0 225.09-92.04 92.04-92.05 92.04-225.09 0-133.04-92.04-225.09-92.05-92.04-225.09-92.04-133.04 0-225.09 92.04-92.04 92.05-92.04 225.09 0 133.04 92.04 225.09 92.05 92.04 225.09 92.04ZM480-480Z" />
        </svg>
      </button>

      <Link
        className={`${mc("base-nav__link")}${pathname === "/settings" ? ` ${mc("base-nav__link--active")}` : ""}`}
        aria-label="goto settings"
        to="/settings"
        onClick={() => vibrate()}
      >
        <svg viewBox="0 -960 960 960">
          <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
        </svg>
      </Link>
    </nav>
  );
}
