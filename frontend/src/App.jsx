import React from "react"

import { useState } from "react";
import Header from "./components/Header";
import ImageGenerator from "./components/ImageGenerator";

import "./styles/main.css";

export default function App() {
  return (
    <>
      <Header />
      <div className="main-container">
        <ImageGenerator />
      </div>
    </>
  );
}
