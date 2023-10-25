import React, { useState, useEffect } from 'react';
import YOUR_CONTRACT_ABI from '../abi/contractabi.json';
import { motion } from 'framer-motion';
import '../styles/Mint.scss';
import Web3 from "web3"


function MintNFT() {
  const [mintAmount, setMintAmount] = useState(1);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(1000);
  const [mintedCount, setMintedCount] = useState(0);

  useEffect(() => {
    // Initialize Web3.js and the smart contract here
    async function initWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable(); // Request user's permission to connect to their wallet
          // const networkId = await web3.eth.net.getId();
          const contractAddress = ''; // Replace with your contract address
          const contract = new web3.eth.Contract(YOUR_CONTRACT_ABI, contractAddress); // Replace with your contract ABI
          setWeb3(web3);
          setContract(contract);

          // Get total supply and minted count
          const totalSupply = await contract.methods.totalSupply().call();
          const mintedCount = await contract.methods.getMintedCount().call();
          setTotalSupply(totalSupply);
          setMintedCount(mintedCount);
        } catch (error) {
          console.error(error);
        }
      }
    }
    initWeb3();
  }, []);

  const handleMint = async () => {
    if (!web3 || !contract) {
      alert('Please connect your wallet and wait for initialization.');
      return;
    }

    try {
      const mintAmountWei = web3.utils.toWei(mintAmount.toString(), 'ether');
      await contract.methods.mint(mintAmountWei).send({
        from: web3.eth.defaultAccount,
        value: mintAmountWei,
      });

      // Update minted count
      const newMintedCount = await contract.methods.getMintedCount().call();
      setMintedCount(newMintedCount);

      alert(`Successfully minted ${mintAmount} NFT(s)`);
    } catch (error) {
      console.error(error);
      alert('Error minting NFT(s). Please check your wallet and try again.');
    }
  };

  


  return (
    <motion.div
      className="mint-container"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Pyscho Chibi Minter
      </motion.h1>
      <div className="mint-status">
        <p>Total Supply: {totalSupply}</p>
        <p>Minted: {mintedCount}</p>
      </div>
      <div className="mint-input">
        <motion.input
          type="number"
          min="1"
          max="100"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        />
        <motion.button className="mint-button" onClick={handleMint} whileHover={{ scale: 1.1 }}>
          Mint {mintAmount} NFT(s)
        </motion.button>
      </div>
    </motion.div>
  );
}

export default MintNFT;
