import React from 'react';

interface CardDisplayProps {
  name: string;
  position: string;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ name, position }) => {
  return (
    <div className="bg-card-bg border border-border-color rounded-lg p-4 shadow-lg h-full flex flex-col justify-between min-h-[120px]">
      <div>
        <h3 className="text-sm font-semibold text-seer-blue-light mb-1 truncate">{position}</h3>
        <p className="text-lg font-serif font-medium text-light-text">{name}</p>
      </div>
      <div className="mt-2 text-xs text-dark-text/70 text-right">
        Position {CELTIC_CROSS_POSITIONS.indexOf(position) + 1}
      </div>
    </div>
  );
};

// Minimalist list of positions to avoid circular dependency with constants.ts
// This is just for the display logic within this component.
const CELTIC_CROSS_POSITIONS: string[] = [
  "Present Situation", "Challenge/Cross", "Distant Past/Root", "Recent Past",
  "Possible Outcome", "Immediate Future", "Your Approach", "External Influences",
  "Hopes & Fears", "Final Outcome"
];
