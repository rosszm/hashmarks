import { Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Player from "./screens/Player";

function App() {
  return (
    <>
      <h1>AppBar</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="player" element={<Player />} />
      </Routes>
    </>
  );
}

export default App;
