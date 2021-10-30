import React from "react";

interface IPageGrid {
  header: React.ReactElement;
  sidebar: React.ReactElement;
  children: React.ReactNode;
}

const PageGrid = (props: IPageGrid) => (
  <main className="none:container h-full flex flex-col bg-gray-900 pr-10">
    <header>{props.header}</header>
    <section className="flex flex-grow overflow-hidden">
      <aside className="max-w-sm overflow-y-scroll">{props.sidebar}</aside>
      <div className="bg-white rounded w-full">{props.children}</div>
    </section>
    <footer>&nbsp;</footer>
  </main>
);

export default PageGrid;
