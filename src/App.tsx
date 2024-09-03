import React, { useState } from "react";
import * as d3 from "d3";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CirclePackingChart from "./CirclePacking/CirclePackingChart";
import { BUBBLES_MOCK } from "./CirclePacking/mock/bubblesData.mock";

function App() {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const [x, y] = d3.pointer(event);
    setData(data.slice(-200).concat(Math.atan2(x, y)));
  }

  return (
    <>
      <div onMouseMove={onMouseMove}>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <CirclePackingChart data={BUBBLES_MOCK} />
    </>
  );
}

export default App;
