import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import NFTContractABI from '../abi/contractabi.json';
import Swal from 'sweetalert2';
import '../styles/Mint.scss';

function NFTMintingComponent() {
  const [contract, setContract] = useState(null);
  const [mintAmount, setMintAmount] = useState(1);
  const [isPresale, setIsPresale] = useState(false);
  const [currentCost, setCurrentCost] = useState('');
  const [regularCost, setRegularCost] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [nftRewards, setNftRewards] = useState(0);
  const [isConnected, setIsConnected] = useState(false); // New state variable

  const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

  async function connectToEthereum() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, NFTContractABI, signer);
        setContract(nftContract);

        const presaleStatus = await nftContract.presaleActive();
        const presaleCost = ethers.utils.formatEther(await nftContract.presaleCost());
        setIsPresale(presaleStatus);
        setCurrentCost(presaleStatus ? `${presaleCost} SGB` : '10 SGB');

        const regularCost = ethers.utils.formatEther(await nftContract.regularCost());
        setRegularCost(regularCost);

        const totalSupply = await nftContract.totalSupply();
        setTotalSupply(totalSupply.toString());

        setIsConnected(true); // Set isConnected to true

        Swal.fire({
          title: 'Connected to Ethereum',
          text: 'You are now connected to Ethereum.',
          icon: 'success',
        });
      } catch (error) {
        console.error('Error connecting to Ethereum:', error);

        Swal.fire({
          title: 'Error',
          text: 'An error occurred while connecting to Ethereum.',
          icon: 'error',
        });
      }
    } else {
      console.log('MetaMask or a similar provider not detected');

      Swal.fire({
        title: 'Info',
        text: 'MetaMask or a similar provider is not detected.',
        icon: 'info',
      });
    }
  }

  const getNFTRewards = useCallback(async () => {
    if (contract) {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, NFTContractABI, signer);

          const connectedAddress = signer.getAddress();
          console.log('Connected Address:', connectedAddress);

          const rewards = await nftContract.nftholderRewards(connectedAddress);
          const rewardsInEther = ethers.utils.formatEther(rewards);

          console.log('NFT Rewards:', rewardsInEther);

          setNftRewards(rewardsInEther);
        } else {
          console.error('Ethereum provider not detected');
        }
      } catch (error) {
        console.error('Error getting NFT rewards:', error);
      }
    }
  }, [contract]);

  async function claimRewards() {
    if (contract) {
      try {
        const tx = await contract.claimRewards();
        await tx.wait();

        Swal.fire({
          title: 'Success',
          text: 'Rewards claimed successfully.',
          icon: 'success',
        });
      } catch (error) {
        console.error('Error claiming rewards:', error);

        Swal.fire({
          title: 'Error',
          text: 'An error occurred while claiming rewards.',
          icon: 'error',
        });
      }
    }
  }

  async function mintNFTs() {
    if (contract) {
      try {
        const etherAmountInWei = ethers.utils.parseEther(isPresale ? '5' : regularCost);
        const totalCostInWei = etherAmountInWei.mul(mintAmount);

        const tx = await contract.mint(mintAmount, { value: totalCostInWei });
        await tx.wait();

        Swal.fire({
          title: 'Success',
          text: `${mintAmount} NFTs minted successfully. Total cost: ${ethers.utils.formatEther(totalCostInWei)} Ether`,
          icon: 'success',
        });
      } catch (error) {
        console.error('Error minting NFTs:', error);

        Swal.fire({
          title: 'Error',
          text: 'An error occurred while minting NFTs.',
          icon: 'error',
        });
      }
    }
  }

  useEffect(() => {
    async function initialize() {
      getNFTRewards();
    }

    initialize();
  }, [getNFTRewards]);

  const increaseMintAmount = () => {
    setMintAmount(mintAmount + 1);
  };

  const decreaseMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  return (
    <div className="minter-container">
      <div className="nft-retro-container">
        <h1 className="nft-retro-title">Psycho Chibi Minter</h1>
        <p className="nft-retro-paragraph"><strong>Please make sure you click connect before attempting to Mint NFTs or Claim rewards</strong></p>

        {!isConnected && (
          <p className="nft-retro-paragraph">
            <strong>You are not connected, please click connect</strong>
          </p>
        )}
        <button className="nft-retro-button" onClick={connectToEthereum}>
          Connect to Ethereum
        </button>
        <p className="nft-retro-paragraph">NFT Reward Percentage: 10%</p>

        <p className="nft-retro-paragraph">Presale Active: {isPresale ? 'Yes' : 'No'}</p>
        <p className="nft-retro-paragraph">Current Cost: {currentCost}</p>
        <p className="nft-retro-paragraph">Presale Cost: 5 SGB</p>
        <p className="nft-retro-paragraph">Post Presale Cost: 10 SGB</p>

        <p className="nft-retro-paragraph">Total Supply: {totalSupply} out of 10000</p>
        <p className="nft-retro-paragraph">Accumulated NFT Rewards: {nftRewards} SGB</p>

        <label className="nft-retro-input-label">
          Mint Amount:
          <div className="nft-retro-mint-amount">
            <button className="nft-retro-button" onClick={decreaseMintAmount}>
              -
            </button>
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="nft-retro-input"
              style={{ inputMode: 'none' }}
            />
            <button className="nft-retro-button" onClick={increaseMintAmount}>
              +
            </button>
          </div>
        </label>

        <button className="nft-retro-button" onClick={mintNFTs}>
          {isPresale ? 'Mint NFTs (Presale)' : 'Mint NFTs (Regular)'}
        </button>
        <button className="nft-retro-button" onClick={claimRewards}>
          Claim Rewards
        </button>
      </div>
    </div>
  );
}

export default NFTMintingComponent;
