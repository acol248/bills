import type { Dispatch, SetStateAction } from "react";

type Item = {
  id: string;
  name: string;
  value: number;
  date: Date;
};

type Category = {
  id: string;
  name: string;
};

type Account = {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "debit";
  brand?: string;
};

interface UseData {
  addItemOpen: boolean;
  items: Array<Item>;
  categories: Array<Category>;
  accounts: Array<Account>;
  currentlyEditing: Item["id"] | undefined;
  accountBrands: Array<{ value: string; label: string; icon: string }>;
  setCurrentlyEditing: Dispatch<SetStateAction<Item["id"] | undefined>>;
  setAddItemOpen: Dispatch<SetStateAction<boolean>>;
  /**
   * Add category
   *
   * @param payload category payload object
   */
  addCategory: (payload: Category) => void;
  /**
   * Edit category, by id
   *
   * @param payload category payload object
   */
  editCategory: (payload: Category) => void;
  /**
   * Remove a category, by id
   *
   * @param id target category id
   */
  removeCategory: (targetId: Category["id"]) => void;
  /**
   * Add item
   *
   * @param payload
   */
  addItem: (payload: Item) => void;
  /**
   * Update item, by id
   *
   * @param payload
   */
  editItem: (payload: Item) => void;
  /**
   * Remove an item, by id
   *
   * @param id
   */
  removeItem: (targetId: Item["id"]) => void;
  /**
   * Add account to list
   */
  addAccount: (payload: Omit<Account, "id">) => void;
  /**
   * Remove account from list, by id
   *
   * @param targetId account id to remove
   */
  removeAccount: (targetId: Account["id"]) => void;
}

export type { UseData, Account, Item, Category };
