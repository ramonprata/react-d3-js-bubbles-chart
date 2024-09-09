import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Bubbles from "./CirclePacking/Bubbles";
import ReactBubbles from "./CirclePacking/ReactBubbles";
import { BUBBLES_MOCK_REAL_DATA } from "./CirclePacking/mock/bubblesData.mock";

function App() {
  return (
    <>
      <ReactBubbles data={BUBBLES_MOCK_REAL_DATA} />
    </>
  );
}

export default App;
