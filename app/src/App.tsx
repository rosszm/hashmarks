import { Route, Routes } from "react-router-dom";
import Home from "./screens/home";
import Player from "./screens/player";
import { NotFound } from "./screens/error"

function App() {
  return (
    <Routes>
      <Route path="hashmarks">
        <Route index element={<Home />} />
        <Route path="player" element={<Player />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
