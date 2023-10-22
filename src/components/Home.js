import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Home.scss';
import logo from '../assets/logo.png';
import clouds from '../assets/upside.png';

import backgroundImage from '../assets/night.jpeg';
import split from '../assets/split.jpeg';
import NewParallax from "../components/parallax/newparallaxhero.js";
import MintNFT from './MintNFT';
import Carosoule from "../components/carosoule/carosoule1.js"

function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const calculateParallax = (speed) => {
    return -scrollY * speed + 'px';
  };

  const parallaxOffset = 2;

  const logoAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, rotate: 360 },
  };

 

  return (
    <div className="home-container">
      <NewParallax />
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      <img src={clouds} alt="clouds" className="clouds" style={{ transform: `translateY(${calculateParallax(0.15)})` }} />
      <motion.div className="logo-container" {...logoAnimation}>
        <img src={logo} alt="Psycho Chibis Mint Logo" className="logo" />
      </motion.div>

      <motion.div
        className="header"
        style={{ opacity: 1, y: scrollY * 0.5 }}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="header-title">Welcome to Psycho Chibis Mint</h1>
        <p className="header-subtitle">Your gateway to unique, mind-bending NFT art.</p>
     <Carosoule />
      </motion.div>
       
      <motion.div
        className="mint-info"
        style={{ opacity: 1, x: -scrollY * 0.5 }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="mint-info-content">
          <div className="mint-info-text">
            <h2>🎨 Mint Your Chibi Art 🎨</h2>
            <p>✨ Join the Psychedelic Chibis community and unleash your inner artist. ✨</p>
            <div className="cost-info">
              <p>💰 Presale Cost: 5 ETH 💰</p>
              <p>💎 Regular Cost: 0.1 BTC 💎</p>
              <p>🚀 Pre-sale starts on <strong>DATE</strong> 🚀</p>
            </div>
            <p className="mint-benefit">🔮 The deeper you dive, the more surreal the rewards! 🔮</p>
            <p>Each mint adds a stroke to the cosmic canvas of Psycho Chibis.</p>
          </div>
        </div>
        <h2>💰 Trippy Revenue Sharing 💰</h2>
        <p>🌈 15% of mint proceeds swirl into the pockets of Psycho Chibi NFT holders. 🌈</p>
        <p className="rewards-info">🌀 The more you mint, the bigger the share you get 🌀</p>
        <h2>🌀 Dive Deeper into the Trippy Abyss 🌀</h2>
        <p className="learn-more-description">🌌 Explore the boundless universe of NFTs and unravel your one-of-a-kind Psychedelic Chibi collection. 🌌</p>
        
      </motion.div>

     

      <motion.div
        className="learn-more"
        style={{ opacity: 1, y: scrollY * 0.5 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MintNFT />
        
      </motion.div>
    </div>
  );
}

export default Home;
