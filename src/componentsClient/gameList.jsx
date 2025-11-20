import { useState } from "react";
import FilterPopup from "./FilterPopup";
import "../styles/layout.css";

function GameList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 8 games, as in your wireframe
  const games = Array(8)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      name: `Game ${index + 1}`,
    }));

  const handleFilterClick = () => setIsFilterOpen(true);
  const handleCloseFilter = () => setIsFilterOpen(false);

  const handleResume = () => {
    console.log("Resume clicked");
  };

  const handleLunch = () => {
    console.log("Lunch clicked");
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-left"></div>
        <div className="header-center">Logo</div>
        <div className="header-right" />
      </header>

      {/* Filter button under home icon */}
      <div className="top-controls">
        <button className="outlined-btn" onClick={handleFilterClick}>
          Filter
        </button>
      </div>

      {/* Games grid */}
      <main className="grid-wrapper">
        <div className="circle-grid">
          {games.map((game) => (
            <button key={game.id} className="circle-btn">
              Game
            </button>
          ))}
        </div>
      </main>

      {/* Bottom buttons */}
      <footer className="footer-controls">
        <button className="outlined-btn" onClick={handleResume}>
          Resume
        </button>
        <button className="outlined-btn" onClick={handleLunch}>
          Lunch
        </button>
      </footer>

      {/* Shared popup filter */}
      {isFilterOpen && (
        <FilterPopup isOpen={isFilterOpen} onClose={handleCloseFilter} />
      )}
    </div>
  );
}

export default GameList;
