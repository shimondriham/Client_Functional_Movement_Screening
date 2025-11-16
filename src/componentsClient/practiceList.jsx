// import { useState } from 'react';
import FilterPopup from "../FilterPopup";

function PracticeList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock practice data - 12 practices as shown in your schema
  const practices = Array(12)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      name: `EXE ${index + 1}`,
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
      {/* Top Icon */}
      {<div>
        <div>Home Icon</div>
      </div>}

      {/* Filter Button */}
      <div>
        <button onClick={handleFilterClick}>Filter</button>
      </div>

      {/* Practices Grid */}
      <div>
        {practices.map((practice) => (
          <div key={practice.id}>
            <div>
              <span>EXE</span>
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

export default PracticeList;
