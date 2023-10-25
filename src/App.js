import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.js';
import Home from './components/Home.js';
import MintNFT from './components/MintNFT.js';
import NFTList from './components/NFTList.js';
import Rewards from './components/Rewards.js';
import { ethers } from 'ethers'; // Import Ethers

import './App.css';

function App() {
  // State to store Ethers provider and signer
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Initialize Ethers when the component mounts
  useEffect(() => {
    async function initializeEthers() {
      // Check if MetaMask is installed
      if (window.ethereum) {
        // Connect to MetaMask
        const ethProvider = new ethers.BrowserProvider(window.ethereum);

        // Request access to write operations
        const ethSigner = await ethProvider.getSigner();

        setProvider(ethProvider);
        setSigner(ethSigner);
      } else {
        // If MetaMask is not installed, you can set up a default provider
        const defaultProvider = ethers.getDefaultProvider();
        setProvider(defaultProvider);
      }
    }

    initializeEthers();
  }, []);

  return (
    <Router>
      <Header />
      {/* Pass Ethers provider and signer as props to the relevant components */}
      <Routes>
        <Route
          path="/"
          element={<Home provider={provider} signer={signer} />}
        />
        <Route
          path="/mint"
          element={<MintNFT provider={provider} signer={signer} />}
        />
        <Route
          path="/nfts"
          element={<NFTList provider={provider} signer={signer} />}
        />
        <Route
          path="/claim"
          element={<Rewards provider={provider} signer={signer} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
