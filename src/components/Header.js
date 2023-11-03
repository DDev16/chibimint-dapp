import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';
import music from "../assets/assets/music.mp3";

function Header() {
  const audioRef = useRef(null);

  useEffect(() => {
    // Function to start playing audio when the component mounts
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .catch(error => console.error("Auto-play failed:", error));
      }
    };

    // Play the audio when the component mounts
    playAudio();
  }, []);

  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/staking">Staking</Link>
        <Link to="/nfts">My Chibis</Link>
      </nav>
      <audio controls autoPlay ref={audioRef}>
        <source src={music} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </header>
  );
}

export default Header;
