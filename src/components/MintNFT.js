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
  const [isConnected, setIsConnected] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const contractAddress = '0x67d269191c92Caf3cD7723F116c85e6E9bf55933';

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

        setIsConnected(true);

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
        const etherAmountInWei = ethers.utils.parseEther(isPresale ? '20' : regularCost);
        const totalCostInWei = etherAmountInWei.mul(mintAmount);

        const referralAddress = referralCode ? ethers.utils.getAddress(referralCode) : ethers.constants.AddressZero;

        const tx = await contract.mintWithReferral(mintAmount, referralAddress, { value: totalCostInWei });
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
        <h1 className="nft-retro-title">Psycho Chibi NFT Minter</h1>
        <p className="nft-retro-paragraph">
          Welcome to the Psycho Chibi NFT Minter! Connect to Songbird, mint your unique NFTs, 
          and take advantage of our referral program. Follow the steps below to get started.
        </p>
  
        {!isConnected && (
          <div>
            <p className="nft-retro-paragraph">
              <strong>Step 1: Connect to Songbird</strong><br />
              To start minting NFTs, please first connect to your Songbird wallet using MetaMask or a similar provider.
            </p>
            <button className="nft-retro-button" onClick={connectToEthereum}>
              Connect to Songbird
            </button>
          </div>
        )}
  
        <p className="nft-retro-paragraph">
          <strong>Step 2: Understand Costs and Rewards</strong><br />
          NFT Reward Percentage: 10%<br />
          Presale Active: {isPresale ? 'Yes' : 'No'}<br />
          Current Cost: {currentCost}<br />
          Presale Cost: 5 SGB<br />
          Post Presale Cost: 10 SGB<br />
          Total Supply: {totalSupply} out of 10000<br />
          Accumulated NFT Rewards: {nftRewards} SGB
        </p>
  
        <p className="nft-retro-paragraph">
          <strong>Step 3: Mint Your NFTs</strong><br />
          Choose the number of NFTs you wish to mint. Remember, there's a limit on how many you can mint in one transaction.
        </p>
        <label className="nft-retro-input-label">
          Mint Amount:
          <div className="nft-retro-mint-amount">
            <button className="nft-retro-button" onClick={decreaseMintAmount}>-</button>
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="nft-retro-input"
              style={{ inputMode: 'none' }}
            />
            <button className="nft-retro-button" onClick={increaseMintAmount}>+</button>
          </div>
        </label>
  
        <p className="nft-retro-paragraph">
  <strong>Step 4: Use a Referral Code (Optional)</strong><br />
  A referral code in our platform is the wallet address of the person who referred you to our NFT minting service. When you use a referral code while minting NFTs, rewards are distributed as follows:
  <ul>
    <li><strong>For the Referrer (whose wallet address is used):</strong> They receive 1000 Songbird for each NFT you mint. This reward is a token of our appreciation for them introducing new users to our platform.</li>
    <li><strong>For You (the Referee):</strong> You will be rewarded with 550 ERC20 tokens for each NFT minted using the referral code. These tokens serve as a bonus for participating in our referral program, enhancing the value of your engagement with our platform.</li>
  </ul>
  If someone referred you to us, make sure to enter their wallet address in the referral code field before you mint your NFTs. This simple act supports our community and rewards those who help it grow.
</p>
<label className="nft-retro-input-label">
  Referrer's Wallet Address:
  <input
    type="text"
    value={referralCode}
    onChange={(e) => setReferralCode(e.target.value)}
    className="nft-retro-input"
  />
</label>

        <button className="nft-retro-button" onClick={mintNFTs}>
          {isPresale ? 'Mint NFTs (Presale)' : 'Mint NFTs (Regular)'}
        </button>
  
        <p className="nft-retro-paragraph">
          <strong>Step 5: Claim Your Rewards</strong><br />
          If you've earned NFT rewards, use the button below to claim them. Ensure you're connected to the correct Songbird account.
        </p>
        <button className="nft-retro-button" onClick={claimRewards}>
          Claim Rewards
        </button>
      </div>
    </div>
  );
  
  
  
}

export default NFTMintingComponent;
