import React, { createContext, useContext, useRef, useCallback } from "react";

type ISaveCallback = () => void;

export interface ISaveContext {
  save: React.MutableRefObject<ISaveCallback>;
  onSave: (callback: ISaveCallback) => void;
}

const SaveContext = createContext<ISaveContext>(undefined!);

export const useSave = (): ISaveContext => {
  const context = useContext(SaveContext);

  if (!context) {
    throw new Error("Must use save context within provider tree");
  }

  return context;
};

interface ISaveProvider {
  children: React.ReactNode;
}

const SaveProvider = (props: ISaveProvider) => {
  const save = useRef<ISaveCallback>(() => null);
  const onSave = useCallback((callback: ISaveCallback) => {
    save.current = callback;
  }, []);

  return (
    <SaveContext.Provider value={{ save, onSave }}>
      {props.children}
    </SaveContext.Provider>
  );
};

export default SaveProvider;
