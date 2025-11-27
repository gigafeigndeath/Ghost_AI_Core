import React from "react"

import { useState } from "react";

export default function ThemeSwitch() {
  const [light, setLight] = useState(true);

  function toggle() {
    setLight((s) => !s);
    document.body.classList.toggle("light-theme");
  }

  return (
    <div
      className="theme-switch"
      onClick={toggle}
      data-mode={light ? "light" : "dark"}
    >
      <div className="knob"></div>
    </div>
  );
}
