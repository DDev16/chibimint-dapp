import React from 'react';
import '../styles/ProgressBar.scss'; // Create this file for styling

const ProgressBar = ({ total, current }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }}>
        {percentage.toFixed(2)}%
      </div>
    </div>
  );
};

export default ProgressBar;
