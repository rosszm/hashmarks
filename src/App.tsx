import { Route, Routes } from "react-router-dom";
import Home from "./screens/home";
import Player from "./screens/player";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="player" element={<Player />} />
    </Routes>
  );
}

export default App;
