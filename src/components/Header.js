import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.scss';
import music from "../assets/Rezz - Sacrificial (Official Video) ft. PVRIS.mp3";

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
  <a href='https://nirvanis-official.vercel.app/' target="_blank" rel="noopener noreferrer">Home</a>
  <Link to="/nfts">My Chibis</Link>
  <Link to="/">Chibi Mint</Link>
</nav>

      <audio ref={audioRef} >
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
