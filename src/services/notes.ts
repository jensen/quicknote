import { supabase, preload } from "services";

interface ISaveNote extends Omit<INote, "id" | "created_at" | "updated_at"> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export const saveNote = (note: ISaveNote) =>
  supabase.from("notes").upsert(note, { onConflict: "id" });

export const deleteNote = (id: string) =>
  supabase.from("notes").delete().match({
    id,
  });

export default preload<INote>(
  "notes",
  supabase
    .from("notes")
    .select("id, title, summary, created_at")
    .order("created_at", { ascending: false }),
  {
    update: (state: INote[], data: INote) => {
      const index = state.findIndex((note) => note.id === data.id);

      if (index >= 0) {
        return [...state.slice(0, index), data, ...state.slice(index + 1)];
      }

      return [data, ...state];
    },
    fragments: (state: INote[], id: string) => {
      const note = state.find((note) => note.id === id);

      if (note?.content) {
        return null;
      }

      return supabase
        .from("notes")
        .select("content")
        .match({ id })
        .then(({ data }) => {
          if (Array.isArray(data)) {
            const [{ content }] = data;

            return {
              ...note,
              content,
            };
          }
        });
    },
    store: (state: INote[]) => {
      localStorage.setItem(
        "notes:order",
        JSON.stringify(state.map((note) => note.id))
      );
    },
  }
);
