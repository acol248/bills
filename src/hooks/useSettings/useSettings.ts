import { createContext, useCallback, useLayoutEffect, useMemo, useState } from "react";

// types
import useLocalStorage from "@blocdigital/uselocalstorage";
import { bufferToString } from "../../helpers/format";

type Settings = {
  theme: "light" | "dark";
  pst: boolean;
  scale: number;
  forceScale: boolean;
  vibrations: boolean;
  privacyMode: boolean;
};

interface UseSettings {
  authCheck: boolean;
  authenticated: boolean;
  theme: "light" | "dark";
  pst: boolean;
  forceScale: boolean;
  privacyMode: boolean;
  scale: number;
  vibrations: boolean;
  toggleTheme: (theme?: "light" | "dark") => void;
  togglePST: () => void;
  toggleForceScale: (state?: boolean) => void;
  togglePrivacyMode: (state?: boolean) => void;
  updateScale: (scale: number) => void;
  toggleVibrations: (state?: boolean) => void;
  vibrate: (param?: { time?: number; callback?: () => void }) => void;
  setupAuthentication: (code: string) => Promise<boolean>;
  verifyAuthentication: (code?: string, genericCheck?: boolean) => Promise<boolean>;
  removeAuthentication: (code: string) => Promise<Boolean>;
  deAuthenticate: () => void;
}

export default function useSettings(): UseSettings {
  const storage = useLocalStorage("local");
  const session = useLocalStorage("session");

  const [data, setData] = useState<Settings>({
    theme: "light",
    pst: false,
    scale: 1.25,
    forceScale: false,
    vibrations: false,
    privacyMode: false,
  });

  const [authenticated, setAuthenticated] = useState(false);

  const toggleTheme = useCallback<UseSettings["toggleTheme"]>(theme => {
    setData(d => {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "dark" || d.theme === "light" ? "#202020" : "#fbf7f5");

      storage.set("settings", { ...d, theme: theme ? theme : d.theme === "light" ? "dark" : "light" });

      return { ...d, theme: theme ? theme : d.theme === "light" ? "dark" : "light" };
    });
  }, []);

  const togglePST = useCallback<UseSettings["togglePST"]>(() => {
    setData(d => {
      storage.set("settings", { ...d, pst: !d.pst });

      return { ...d, pst: !d.pst };
    });
  }, []);

  const toggleForceScale = useCallback<UseSettings["toggleForceScale"]>(state => {
    setData(d => {
      document.body.style.setProperty("--core-scale", state ?? !d.forceScale ? d.scale.toString() : "1");

      storage.set("settings", { ...d, forceScale: state ?? !d.forceScale });

      return { ...d, forceScale: state ?? !d.forceScale };
    });
  }, []);

  const updateScale = useCallback<UseSettings["updateScale"]>(scale => {
    setData(d => ({ ...d, scale }));
  }, []);

  const toggleVibrations = useCallback<UseSettings["toggleVibrations"]>(state => {
    setData(d => {
      storage.set("settings", { ...d, vibrations: state !== undefined ? state : !d.vibrations });

      return { ...d, vibrations: state !== undefined ? state : !d.vibrations };
    });
  }, []);

  const togglePrivacyMode = useCallback<UseSettings["togglePrivacyMode"]>(state => {
    setData(d => {
      storage.set("settings", { ...d, privacyMode: state !== undefined ? state : !d.privacyMode });

      return { ...d, privacyMode: state !== undefined ? state : !d.privacyMode };
    });
  }, []);

  const setupAuthentication = useCallback<UseSettings["setupAuthentication"]>(async code => {
    return new Promise(async (resolve, reject) => {
      if (!code) reject(false);

      const encoded = new TextEncoder().encode(code);
      const hash = await window.crypto.subtle.digest("sha-256", encoded);

      if (!hash) reject(false);

      storage.set("check", bufferToString(hash));
      resolve(true);
    });
  }, []);

  const verifyAuthentication = useCallback<UseSettings["verifyAuthentication"]>(async (code, genericCheck) => {
    return new Promise(async (resolve, reject) => {
      if (genericCheck && storage.get("check")) {
        const c_encoded = new TextEncoder().encode(code);
        const c_hash = await window.crypto.subtle.digest("sha-256", c_encoded);

        if (bufferToString(c_hash) !== storage.get("check")) return reject(false);

        return resolve(true);
      }

      if (!storage.get("check")) {
        setAuthenticated(true);

        reject(false);
      }

      const c_encoded = new TextEncoder().encode(code);
      const c_hash = await window.crypto.subtle.digest("sha-256", c_encoded);

      if (bufferToString(c_hash) !== storage.get("check")) reject(false);

      const s_encoded = new TextEncoder().encode(bufferToString(c_hash));
      const s_hash = await window.crypto.subtle.digest("sha-256", s_encoded);

      session.set("check", bufferToString(s_hash));
      setAuthenticated(true);
      resolve(true);
    });
  }, []);

  const removeAuthentication = useCallback<UseSettings["removeAuthentication"]>(code => {
    return new Promise(async (resolve, reject) => {
      const c_encoded = new TextEncoder().encode(code);
      const c_hash = await window.crypto.subtle.digest("sha-256", c_encoded);

      if (bufferToString(c_hash) !== storage.get("check")) reject(false);

      storage.remove("check");
      resolve(true);
    });
  }, []);

  const vibrate = useCallback<UseSettings["vibrate"]>(
    param => {
      const { time = 20, callback } = param || {};

      if (!("vibrate" in navigator)) return callback && callback();

      if (data.vibrations) navigator.vibrate(time);

      return callback && callback();
    },
    [data.vibrations]
  );

  // adjust scale style
  useLayoutEffect(() => {
    document.body.style.setProperty("--core-scale", data.forceScale ? data.scale.toString() : "1");
  }, [data.forceScale, data.scale]);

  // manage prefer system theme
  useLayoutEffect(() => {
    if (!data.pst) return;

    const match = window.matchMedia("(prefers-color-scheme: dark)");

    /**
     * Change theme config on system theme change
     *
     * @param eventObj event object
     * @param eventObj.matches whether query matches
     */
    const mediaUpdate = ({ matches }: MediaQueryListEvent) => {
      const sysTheme = matches ? "dark" : "light";

      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", sysTheme === "dark" ? "#202020" : "#fbf7f5");

      setData(d => ({ ...d, theme: sysTheme }));
    };

    // run once
    mediaUpdate({ matches: match.matches } as MediaQueryListEvent);

    match.addEventListener("change", mediaUpdate);

    return () => match.removeEventListener("change", mediaUpdate);
  }, [data.pst]);

  // get theme cookie value
  useLayoutEffect(() => {
    if (!storage) return;

    const _data = storage.get<Settings>("settings");

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", (_data ?? { theme: "light" }).theme === "dark" ? "#202020" : "#fbf7f5");

    if (_data) setData(_data);
  }, [storage]);

  return useMemo(
    () => ({
      authCheck: Boolean(storage.get("check")),
      authenticated,
      theme: data.theme,
      pst: data.pst,
      forceScale: data.forceScale,
      scale: data.scale,
      vibrations: data.vibrations,
      privacyMode: data.privacyMode,
      togglePrivacyMode,
      toggleTheme,
      togglePST,
      toggleForceScale,
      updateScale,
      toggleVibrations,
      vibrate,
      setupAuthentication,
      verifyAuthentication,
      removeAuthentication,
      deAuthenticate: () => setAuthenticated(false),
    }),
    [
      storage,
      authenticated,
      data.theme,
      data.pst,
      data.forceScale,
      data.scale,
      data.vibrations,
      data.privacyMode,
      toggleTheme,
      togglePST,
      toggleForceScale,
      updateScale,
      toggleVibrations,
      vibrate,
      setupAuthentication,
      verifyAuthentication,
      removeAuthentication,
    ]
  );
}

export const SettingsContext = createContext<UseSettings>({
  authCheck: false,
  authenticated: false,
  theme: "light",
  pst: false,
  forceScale: true,
  scale: 1,
  vibrations: false,
  privacyMode: false,
  toggleTheme: () => {},
  togglePST: () => {},
  toggleForceScale: () => {},
  togglePrivacyMode: () => {},
  updateScale: () => {},
  toggleVibrations: () => {},
  vibrate: () => {},
  setupAuthentication: async () => false,
  verifyAuthentication: async () => false,
  removeAuthentication: async () => false,
  deAuthenticate: () => {},
});
