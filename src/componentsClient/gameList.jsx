// import { useState } from 'react';
import FilterPopup from "../filterPopup";

function GamePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock game data - 8 games as shown in schema
  const games = Array(8)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      name: `Game ${index + 1}`,
    }));

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const handleResume = () => {
    console.log("Resume clicked");
    // Add your resume logic here
  };

  const handleLunch = () => {
    console.log("Lunch clicked");
    // Add your lunch logic here
  };

  return (
    <div>
      {/* Header Section */}
      <div>
        <div>
          <div>Game list</div>
        </div>
        <div>
          <div>Instructions</div>
        </div>
      </div>

      {/* Top Icons */}
      <div>
        <div>Home Icon</div>
        <div>Cart Icon</div>
      </div>

      {/* Filter Button */}
      <div>
        <button onClick={handleFilterClick}>Filter</button>
      </div>

      {/* Games Grid */}
      <div>
        {games.map((game) => (
          <div key={game.id}>
            <div>
              <span>Game</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div>
        <button onClick={handleResume}>Resume</button>
        <button onClick={handleLunch}>Lunch</button>
      </div>

      {/* Filter Popup */}
      {isFilterOpen && (
        <FilterPopup isOpen={isFilterOpen} onClose={handleCloseFilter} />
      )}
    </div>
  );
}

export default GamePage;
