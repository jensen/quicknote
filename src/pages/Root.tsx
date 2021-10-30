import React, { Suspense } from "react";
import { Routes, Route, useParams, Link } from "react-router-dom";

import SaveProvider from "context/save";
import PageGrid from "layout/PageGrid";
import Header from "components/Header";
import NoteList from "components/NoteList";
import NoteEditor from "components/NoteEditor";

const EditNote = () => <NoteEditor key={useParams().id} />;

const NoContent = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-900">
      <h1 className="text-white text-6xl font-bold">QuickNotes</h1>
      <hr className="w-1/2 border-b border-gray-800 mt-8 mb-4" />
      <p className="text-white text-md">
        Create a
        <Link to="/new" className="text-blue-400 hover:text-white text-xl px-2">
          {`New Note`}
        </Link>
        or choose an exisitng one from the list.
      </p>
    </div>
  );
};

const Root = () => {
  return (
    <SaveProvider>
      <PageGrid
        header={<Header />}
        sidebar={
          <Suspense fallback={null}>
            <Routes>
              <Route path="*" element={<NoteList />} />
              <Route path=":id" element={<NoteList />} />
            </Routes>
          </Suspense>
        }
      >
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<NoContent />} />
            <Route path="new" element={<NoteEditor />} />
            <Route path=":id" element={<EditNote />} />
          </Routes>
        </Suspense>
      </PageGrid>
    </SaveProvider>
  );
};

export default Root;
