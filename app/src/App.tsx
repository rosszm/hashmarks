import { Route, Routes } from "react-router-dom";
import Home from "./screens/home";
import Player from "./screens/player";
import { NotFound } from "./screens/error"
import { useEffect } from "react";
import { NhlSuggestClient } from "./common/nhl-api";

function App() {
  // Perform an initial API query on application startup. This reduces the response time for the API
  // when it is hosted on a service that spins down inactive containers.
  useEffect(() => {
    new NhlSuggestClient("v1").getActivePlayerSuggestions("");
  }, []);

  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="player" element={<Player />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
