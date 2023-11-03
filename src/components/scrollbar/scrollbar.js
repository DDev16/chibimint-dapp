import React, { useState } from 'react';
import '../../styles/scrollbar.css';

const CustomScrollbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const newScrollPosition = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollPosition(newScrollPosition);
  };

  return (
    <div className="CustomScrollbar" onScroll={handleScroll}>
    
    </div>
  );
};

export default CustomScrollbar;
