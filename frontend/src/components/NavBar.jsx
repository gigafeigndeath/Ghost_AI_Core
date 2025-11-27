import React from "react"

import { useState } from "react";

export default function NavBar() {
  const [active, setActive] = useState("image");

  return (
    <div className="right-nav">
      <nav className="nav-buttons">
        {["image", "video", "other"].map((page) => (
          <button
            key={page}
            className={active === page ? "nav-btn active" : "nav-btn"}
            onClick={() => setActive(page)}
          >
            {page === "image" && "Kandinsky AI"}
            {page === "video" && "YandexART AI"}
            {page === "other" && "??? AI"}
          </button>
        ))}
      </nav>
    </div>
  );
}
