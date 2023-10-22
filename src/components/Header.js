import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';
function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/mint">Mint</Link>
        <Link to="/claim">Rewards</Link>
        <Link to="/nfts">My Chibis</Link>
      </nav>
    </header>
  );
}

export default Header;
