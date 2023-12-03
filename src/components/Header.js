import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.scss';
import music from "../assets/assets/music.mp3";

function Header() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <header  style={{ fontFamily: 'BlimeyVariable'}}>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/staking">Staking</Link>
        <Link to="/nfts">My Chibis</Link>
      </nav>
      <audio ref={audioRef}>
        <source src={music} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={togglePlay} className="play-button">
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>
    </header>
  );
}

export default Header;
