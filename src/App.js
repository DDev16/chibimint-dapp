import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.js';
import Home from './components/Home.js';
import MintNFT from './components/MintNFT.js';
import NFTList from './components/NFTList.js';
import CustomScrollbar from './components/scrollbar/scrollbar.js'

import "./App.css"

function App() {
  return (
      <Router>
        <Header />
        <CustomScrollbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<MintNFT />} />
          <Route path="/nfts" element={<NFTList />} />
        </Routes>
      </Router>
  );
}

export default App;
