import { createContext, useEffect, useMemo, useRef, useState } from "react";

// helpers
import { generateUniqueId } from "../../helpers/generateId";
import { decodeBase64, encodeBase64 } from "../../helpers/encodeBase64";

export default function useBills() {
  const initialised = useRef(false);
  const _storageList = localStorage.getItem("bills");

  const [bills, setBills] = useState(_storageList ? decodeBase64(_storageList) : []);

  /**
   * Add new bill to list
   *
   * @param {object} payload name and value of bill
   */
  const addBill = payload => {
    setBills(b => [...b, { id: generateUniqueId(16), ...payload }]);
  };

  /**
   * Remove bill from list
   *
   * @param {string} target id of target item
   */
  const removeBill = target => {
    setBills(b => b.filter(({ id }) => id !== target));
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
    () => ({ bills, total: bills.reduce((total, { value }) => (total += parseFloat(value)), 0), addBill, removeBill }),
    [bills, addBill]
  );
}

export const BillsContext = createContext(null);
