import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ResourceProvider from "context/resources";
import Root from "pages/Root";

import "./main.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element required");
}

const Application = (
  <Suspense fallback={null}>
    <ResourceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Root />} />
        </Routes>
      </BrowserRouter>
    </ResourceProvider>
  </Suspense>
);

ReactDOM.createRoot(root).render(
  <React.StrictMode>{Application}</React.StrictMode>
);
