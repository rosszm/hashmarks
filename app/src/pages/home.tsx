import { useEffect } from "react";
import { NhlPlayerSearch } from "../components/search";
import './home.scss';

/**
 * The Home component.
 *
 * This component represents the home / splash screen of the app.
 */
function Home() {
  useEffect(() => {
    document.title = `Hashmarks - Hockey Stats Visualization`;
  }, [])

  return (
    <main className="splash container">
      <div className="splash-title">
        <h1>HASHMARKS</h1>
        <h2>Hockey Stats Visualization</h2>
      </div>
      <NhlPlayerSearch />
    </main>
  );
}

export default Home;
