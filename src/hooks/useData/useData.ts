import useLocalStorage from "@blocdigital/uselocalstorage";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

// types
export type Item = {
  id: string;
  name: string;
  value: number;
  date: Date;
};

export type Category = {
  id: string;
  name: string;
};

interface UseData {
  addItemOpen: boolean;
  items: Array<Item>;
  categories: Array<Category>;
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
}

export default function useData(): UseData {
  const storage = useLocalStorage('local');

  const [addItemOpen, setAddItemOpen] = useState(false);

  const [items, setItems] = useState<Array<Item>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);

  const addCategory = useCallback<UseData["addCategory"]>((payload) => {
    setCategories((cats) => [...cats, { ...payload, id: uuidv4() }]);
  }, []);

  const editCategory = useCallback<UseData["editCategory"]>((payload) => {
    setCategories((cats) => {
      const index = cats.findIndex(({ id }) => id === payload.id);

      if (index < 0) return cats;

      cats[index] = payload;

      return [...cats];
    });
  }, []);

  const removeCategory = useCallback<UseData["removeCategory"]>((targetId) => {
    setCategories((cats) => [...cats.filter(({ id }) => id !== targetId)]);
  }, []);

  const addItem = useCallback<UseData["addItem"]>((payload) => {
    setItems((itms) => [...itms, { ...payload, id: uuidv4() }]);
  }, []);

  const editItem = useCallback<UseData["editItem"]>((payload) => {
    setItems((itms) => {
      const index = itms.findIndex(({ id }) => id === payload.id);

      if (index < 0) return itms;

      itms[index] = payload;

      return [...itms];
    });
  }, []);

  const removeItem = useCallback<UseData["removeItem"]>((targetId) => {
    setItems((itms) => itms.filter(({ id }) => id !== targetId));
  }, []);

  // update localstorage on change
  useEffect(() => {
    if (!storage) return;

    const _items = storage.get<Array<Item>>('items');

    if (!_items || (_items.length && items.length < 1)) return;

    storage.set('items', items);
  }, [storage, items]);

  // get/init data when app loads
  useLayoutEffect(() => {
    if (!storage.get('items')) {
      console.log("dog's bollocks");

      storage.init('items', []);

      return;
    }

    const items = storage.get<Array<Item>>('items');
    
    setItems(items ?? [])
  }, [storage]);

  return {
    addItemOpen,
    items,
    categories,
    setAddItemOpen,
    addCategory,
    editCategory,
    removeCategory,
    addItem,
    editItem,
    removeItem,
  };
}

export const DataContext = createContext<UseData>({
  addItemOpen: false,
  items: [],
  categories: [],
  setAddItemOpen: () => {},
  addCategory: () => {},
  editCategory: () => {},
  removeCategory: () => {},
  addItem: () => {},
  editItem: () => {},
  removeItem: () => {},
});
