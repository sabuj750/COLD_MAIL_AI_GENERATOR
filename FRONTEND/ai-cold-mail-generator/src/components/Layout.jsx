import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = () => {
  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-50/70">
      {/* page-wide soft glows */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/40 to-fuchsia-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-100/50 blur-3xl" />

      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />
        {/* isolate keeps page-level glows (negative z-index) inside this area */}
        <main className="relative isolate flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;