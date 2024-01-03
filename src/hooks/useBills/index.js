import { createContext, useEffect, useMemo, useRef, useState } from "react";

// helpers
import { generateUniqueId } from "../../helpers/generateId";
import { decodeBase64, encodeBase64 } from "../../helpers/encodeBase64";

export default function useBills() {
  const initialised = useRef(false);
  const _storageList = localStorage.getItem("bills");

  const [bills, setBills] = useState(_storageList ? decodeBase64(_storageList) : {});

  /**
   * Add new list
   *
   * @param {string} name new category name
   * @returns
   */
  const addList = list => {
    if (!list) return;

    setBills(b => {
      if (b[list]) return b;

      return { ...b, [list]: [] };
    });
  };

  /**
   * Remove a list
   *
   * @param {string} list name of list to delete
   */
  const removeList = list => {
    setBills(b => {
      delete b[list];

      return { ...b };
    });
  };

  /**
   * Add new bill to list
   *
   * @param {object} payload name and value of bill
   */
  const addBill = (payload, list = "default") => {
    setBills(b => {
      if (!b[list]) return b;

      return { ...b, [list]: [...b[list], { ...payload, id: generateUniqueId(16) }] };
    });
  };

  /**
   * Remove bill from list
   *
   * @param {string} target id of target item
   */
  const removeBill = target => {
    setBills(b => {
      return Object.keys(b).reduce((a, k) => {
        if (a[k].find(({ id }) => id !== target)) return { ...a, [k]: a[k].filter(({ id }) => id !== target) };

        return a;
      }, b);
    });
  };

  /**
   * Update existing bill record
   *
   * @param {object} bill bill object
   */
  const updateBill = (bill, previousList, newlist) => {
    setBills(b => ({
      ...b,
      [previousList]: [...b[previousList].filter(({ id }) => id !== bill.id)],
      [newlist]: [...b[newlist].filter(({ id }) => id !== bill.id), bill],
    }));
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
      total: Object.keys(bills).reduce((t, k) => (t += bills[k].reduce((it, itm) => (it += itm.value), 0)), 0),
      addBill,
      addList,
      removeBill,
      removeList,
      updateBill,
    }),
    [bills, addBill, addList, removeBill, removeList, updateBill]
  );
}

export const BillsContext = createContext(null);
