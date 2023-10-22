import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import MintNFT from './components/MintNFT';
import NFTList from './components/NFTList';
import Rewards from './components/Rewards';

import "./App.css"

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mint" element={<MintNFT />} />
        <Route path="/nfts" element={<NFTList />} />
        <Route path="/claim" element={<Rewards />} />
      </Routes>
    </Router>
  );
}

export default App;
