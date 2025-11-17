import { useState } from "react";
import FilterPopup from "./FilterPopup";
import "../styles/layout.css";

function PracticeList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const practices = Array(8)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      name: `EXE ${index + 1}`,
    }));

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="home-icon" />
        </div>
        <div className="header-center">Logo</div>
        <div className="header-right" />
      </header>

      {/* Filter button */}
      <div className="top-controls">
        <button className="outlined-btn" onClick={() => setIsFilterOpen(true)}>
          Filter
        </button>
      </div>

      {/* Grid */}
      <main className="grid-wrapper">
        <div className="circle-grid">
          {practices.map((practice) => (
            <button key={practice.id} className="circle-btn">
              EXE
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-controls">
        <button className="outlined-btn">Resume</button>
        <button className="outlined-btn">Lunch</button>
      </footer>

      {/* Popup */}
      {isFilterOpen && (
        <FilterPopup
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}

export default PracticeList;
