import React, { useState } from "react";

interface TutorialSliderProps {
  children: React.ReactNode[];
  visibleCount: number;
}

const TutorialSlider: React.FC<TutorialSliderProps> = ({
  children,
  visibleCount,
}) => {
  const [startIndex, setStartIndex] = useState(0);

  const maxIndex = Math.max(0, children.length - visibleCount);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - visibleCount));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxIndex, prev + visibleCount));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        style={{ fontSize: 24, padding: "0 12px" }}
      >
        ←
      </button>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {children.slice(startIndex, startIndex + visibleCount)}
      </div>
      <button
        onClick={handleNext}
        disabled={startIndex >= maxIndex}
        style={{ fontSize: 24, padding: "0 12px" }}
      >
        →
      </button>
    </div>
  );
};

export default TutorialSlider;
