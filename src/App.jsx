import { useState } from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";
import SearchBox from "./components/SearchBox";
import { heritageSites } from "./data/heritageSites";
import "./index.css";

export default function App() {
  const [flyTarget, setFlyTarget] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");

  return (
    <div className="app">
      <Header
        sites={heritageSites}
        activeFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Search bar floats over the map */}
      <div className="search-overlay">
        <SearchBox
          sites={heritageSites}
          onSelect={(site) => {
            setSelectedFilter("All"); // Reset filter so selected marker is visible
            setFlyTarget({ ...site, _ts: Date.now() });
          }}
        />
      </div>

      <main className="map-area">
        <MapView
          sites={heritageSites}
          flyTarget={flyTarget}
          selectedFilter={selectedFilter}
        />
      </main>
    </div>
  );
}
