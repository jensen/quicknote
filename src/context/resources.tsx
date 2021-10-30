import { useState, useContext, useCallback, createContext } from "react";
import { IResourceLoader } from "services";
import notes from "services/notes";

interface IResourceContext {
  notes: IResourceLoader<INote>;
}

const ResourceContext = createContext<IResourceContext>({
  notes,
});

export const useResource = (): IResourceContext => {
  const context = useContext(ResourceContext);

  if (!context) {
    throw new Error("Must use resoruce context within provider tree");
  }

  return context;
};

interface IUseNotes {
  addNote: (note: INote) => void;
  moveNote: (from: number, to: number) => void;
  removeNote: (id: string) => void;
  notes: INote[];
}

export const useNotes = (): IUseNotes => {
  const { notes } = useResource();

  const addNote = useCallback(
    (note: INote) => {
      notes.update(note);
    },
    [notes]
  );

  const removeNote = useCallback(
    (id: string) => {
      notes.remove(id);
    },
    [notes]
  );

  const moveNote = useCallback(
    (from, to) => {
      notes.move(from, to);
    },
    [notes]
  );

  return { addNote, removeNote, moveNote, notes: notes.read() };
};

interface IUseNote {
  note: INote | undefined;
}

export const useNote = (id?: string): IUseNote => {
  const { notes } = useResource();

  const note = notes.read(id).find((note) => note.id === id);

  return {
    note,
  };
};

interface IResourceProvider {
  children: React.ReactNode;
}

const ResourceProvider = (props: IResourceProvider) => {
  const [resources] = useState({
    notes,
  });

  return (
    <ResourceContext.Provider value={resources}>
      {props.children}
    </ResourceContext.Provider>
  );
};

export default ResourceProvider;
