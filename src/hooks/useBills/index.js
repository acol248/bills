import { createContext, useEffect, useMemo, useRef, useState } from "react";

// helpers
import { generateUniqueId } from "../../helpers/generateId";
import { decodeBase64, encodeBase64 } from "../../helpers/encodeBase64";

export default function useBills() {
  const initialised = useRef(false);
  const _storageList = localStorage.getItem("bills");

  const [bills, setBills] = useState(_storageList ? decodeBase64(_storageList) : { default: [] });

  /**
   * Add new bill to list
   *
   * @param {object} payload name and value of bill
   */
  const addBill = (payload, category = "default") => {
    setBills(b => ({
      ...b,
      ...(b[category]
        ? { [category]: [...b[category], { id: generateUniqueId(16), ...payload }] }
        : { [category]: [{ id: generateUniqueId(16), ...payload }] }),
    }));
  };

  /**
   * Remove bill from list
   *
   * @param {string} target id of target item
   */
  const removeBill = target => {
    setBills(b => {
      for (const key in b) if (Array.isArray(b[key])) b[key] = b[key].filter(item => item.id !== target);

      return b;
    });
  };

  /**
   * Update existing bill record
   *
   * @param {object} bill bill object
   */
  const updateBill = bill => {
    setBills(b => [...b.filter(({ id }) => id !== bill.id), bill]);
  };

  // update localstorage
  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;

      return;
    }

    localStorage.setItem("bills", encodeBase64(bills));
  }, [bills]);

  return useMemo(
    () => ({
      bills,
      total:
        Object.keys(bills).reduce((t, k) => {
          t += bills[k].reduce((it, itm) => (it += itm.value), 0) || 0;
        }, 0) || 0,
      addBill,
      removeBill,
      updateBill,
    }),
    [bills, addBill, removeBill, updateBill]
  );
}

export const BillsContext = createContext(null);
