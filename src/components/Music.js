import React, { useState } from 'react';

const Music = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.createRef();

  const playPauseToggle = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <h1>Music Player</h1>
      <audio ref={audioRef} controls>
        <source src="your-audio-file.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={playPauseToggle}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default Music;
