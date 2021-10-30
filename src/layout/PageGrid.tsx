import React from "react";

interface IPageGrid {
  header: React.ReactElement;
  sidebar: React.ReactElement;
  children: React.ReactNode;
}

const PageGrid = (props: IPageGrid) => (
  <main className="none:container h-full flex flex-col bg-gray-900 ">
    <header>{props.header}</header>
    <section className="flex flex-grow overflow-hidden">
      <aside className="max-w-sm overflow-y-scroll">{props.sidebar}</aside>
      <div className="w-full overflow-y-scroll bg-white rounded-l">
        {props.children}
      </div>
    </section>
    <footer>Test</footer>
  </main>
);

export default PageGrid;
