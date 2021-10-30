import { supabase, preload } from "services";

interface ISaveNote extends Omit<INote, "id" | "created_at" | "updated_at"> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}
export const loadNote = (id: string) =>
  supabase.from("notes").select("content").match({ id });

export const saveNote = (note: ISaveNote) =>
  supabase.from("notes").upsert(note, { onConflict: "id" });

export const deleteNote = (id: string) =>
  supabase.from("notes").delete().match({
    id,
  });

/*
  1. We initially download the data we need for our list
  of notes. We omit the "content" of each note
  and delay requesting "content" until the user has indicated
  that they would like to view the note.
*/
export default preload<INote>(
  "notes",
  supabase
    .from("notes")
    .select("id, title, summary, created_at")
    .order("created_at", { ascending: false }),
  {
    /* When we rely on a cache it is very important that
       we apply any mutations that we make on the server
       to the client as well.

       This function takes the existing state and a new
       note. It decides if it is an addition to front of
       the list or a update somewhere within the list.

       When we create a new note we perform an `upsert`
       with Supabase, and so this `update` function also
       performs an upsert for the cache.
    */
    update: (state: INote[], data: INote) => {
      const index = state.findIndex((note) => note.id === data.id);

      if (index >= 0) {
        return [...state.slice(0, index), data, ...state.slice(index + 1)];
      }

      return [data, ...state];
    },
    /*
      2. This is the second part of the data load process.
      This function takes the state and an id of the resource
      that is needed. If the content already exists, then we
      don't need to load it. If it does not exist yet, then
      we can make the request. When this request is complete
      the rest of the data for the note will be added to the cache.
    */
    fragments: (state: INote[], id: string) => {
      const note = state.find((note) => note.id === id);

      if (note?.content) {
        return null;
      }

      return loadNote(id).then(({ data }) => {
        if (Array.isArray(data)) {
          const [{ content }] = data;

          return {
            ...note,
            content,
          };
        }
      });
    },
    /* 
      During operations in the resource loading flow
      we have the opportunity to store info in
      localStorage. This is useful for the ordering feature.
      
      Honestly this was added last minute, and seemed to be
      the quickest way to hook into the different read,
      preload, move operations for reasources.
    */
    store: (state: INote[]) => {
      localStorage.setItem(
        "notes:order",
        JSON.stringify(state.map((note) => note.id))
      );
    },
  }
);
