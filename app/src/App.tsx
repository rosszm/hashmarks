import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import PlayerPage from "./pages/player";
import { NotFound } from "./pages/error"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Disclaimer } from "./components/footer";


const client = new ApolloClient({
  uri: process.env.NODE_ENV === "production" ?
    process.env.REACT_APP_API_URL_PROD + "/graphql" :
    process.env.REACT_APP_API_URL_DEV + "/graphql",
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="player/:id" element={<PlayerPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Disclaimer />
    </ApolloProvider>
  );
}

export default App;
