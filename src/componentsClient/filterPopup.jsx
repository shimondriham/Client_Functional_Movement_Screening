import { useState } from "react";

function FilterPopup({ isOpen, onClose }) {
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Common options for dropdowns
  const timeOptions = [
    "5 minutes",
    "10 minutes",
    "15 minutes",
    "30 minutes",
    "1 hour",
  ];
  const levelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const typeOptions = ["Action", "Puzzle", "Strategy", "Adventure", "Sports"];

  const handleApply = () => {
    console.log("Filters applied:", {
      selectedTime,
      selectedLevel,
      selectedType,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>PopUp Filter</h2>

        {/* Time Filter */}
        <div className="filter-row">
          <label htmlFor="time-select">Time</label>
          <select
            id="time-select"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">Drop down with options</option>
            {timeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div className="filter-row">
          <label htmlFor="level-select">Level</label>
          <select
            id="level-select"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">Drop down with options</option>
            {levelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="filter-row">
          <label htmlFor="type-select">Type</label>
          <select
            id="type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Drop down with options</option>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Resume Button */}
        <div className="popup-actions">
          <button onClick={handleApply} className="resume-btn">
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterPopup;
