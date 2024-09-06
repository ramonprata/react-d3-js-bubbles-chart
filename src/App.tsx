import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Bubbles from "./CirclePacking/Bubbles";
import ReactBubbles from "./CirclePacking/ReactBubbles";
import { BUBBLES_MOCK_REAL_DATA } from "./CirclePacking/mock/bubblesData.mock";

function App() {
  return (
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      {/* <Bubbles data={BUBBLES_MOCK_REAL_DATA} /> */}
      <ReactBubbles data={BUBBLES_MOCK_REAL_DATA} />
    </>
  );
}

export default App;
