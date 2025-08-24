import React from "react";
import { Outlet } from "react-router-dom";
// import TopBar from "./TopBar";
// import Navbar from "./Navbar";


export default function Layout() {
  return (
    <>
      <header>
        {/* <Navbar /> */}
        {/* <TopBar /> */}
      </header>

      <main className="site-content">
        <Outlet />
      </main>

    </>
  );
}