import { createContext, useContext, useSyncExternalStore } from "react";
import { platforms } from "./data";

export function createProductSelection() {
  let selected = 0;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => selected,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    select: (index: number) => {
      if (selected === index) return;
      selected = index;
      listeners.forEach(listener => listener());
    },
  };
}

export const ProductSelectionContext = createContext<ReturnType<typeof createProductSelection> | null>(null);

function useProductSelection() {
  const selection = useContext(ProductSelectionContext);
  if (!selection) throw new Error("ProductSelectionContext is missing");
  return selection;
}

export function useSelectedPlatform() {
  const selection = useProductSelection();
  const index = useSyncExternalStore(selection.subscribe, selection.getSnapshot);
  return platforms[index];
}

export function usePlatformTab(index: number) {
  const selection = useProductSelection();
  const selected = useSyncExternalStore(selection.subscribe, () => selection.getSnapshot() === index);
  return { selected, onSelect: selection.select };
}
