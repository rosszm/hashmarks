import NhlPlayerSearch from "../components/search";
import './home.scss';

function Home() {
  return (
    <main id="splash" className="container">
      <div className="title">
        <h1>HASHMARKS</h1>
        <h2>NHL Player Data Visualization</h2>
      </div>
      <NhlPlayerSearch />
    </main>
  );
}

export default Home;
