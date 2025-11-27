import React from "react"

import ThemeSwitch from "./ThemeSwitch";
import NavBar from "./NavBar";
import "../styles/main.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="left-group">
        <div className="brand">
          <img src="/src/assets/Frame 1(2).png" className="goga" />
          <div>
            <div className="title">Ghost</div>
            <div className="subtitle">AI Core</div>
          </div>
        </div>

        <ThemeSwitch />
      </div>

      <NavBar />
    </header>
  );
}
