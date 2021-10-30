import React, { useState, Suspense } from "react";
import { useParams } from "react-router-dom";

import { useNotes } from "context/resources";
import { EditorToolbarSkeleton } from "components/EditorToolbar";
import NoteBodySkeleton from "components/NoteBodySkeleton";

import("components/NoteBody");

const NoteBody = React.lazy(() => import("components/NoteBody"));

const NoteEditor = () => {
  const { id } = useParams();

  const { notes } = useNotes();

  const note = notes.find((note) => note.id === id);

  const [title, setTitle] = useState(note?.title || "");

  return (
    <div className="h-full px-4 py-4 flex flex-col">
      <input
        className="text-4xl focus:outline-none"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Title"
      />
      <hr className="my-2" />
      <Suspense
        fallback={
          <>
            <EditorToolbarSkeleton />
            <hr className="my-2" />
            <NoteBodySkeleton />
          </>
        }
      >
        <NoteBody title={title} />
      </Suspense>
    </div>
  );
};

export default NoteEditor;
