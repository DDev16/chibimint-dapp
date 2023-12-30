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
  const [connectedAddress, setConnectedAddress] = useState('');
  const [totalLPFunds, setTotalLPFunds] = useState('');
  const [totalDelegationFunds, setTotalDelegationFunds] = useState('');


  const contractAddress = '0xaaF158923aDD9763a4eF5fDFB55992E5a3aEEC8d';

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
        setCurrentCost(presaleStatus ? `${presaleCost} SGB` : '40 SGB');
  
        const regularCost = ethers.utils.formatEther(await nftContract.regularCost());
        setRegularCost(regularCost);
  
        const totalSupply = await nftContract.totalSupply();
        setTotalSupply(totalSupply.toString());
  
        const connectedAddress = await signer.getAddress(); // Get the connected address
        setConnectedAddress(connectedAddress); // Set the connected address state
  
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

  const fetchLPAndDelegationFunds = useCallback(async () => {
    if (contract) {
      try {
        const lpFunds = await contract.getTotalLPFunds();
        const delegationFunds = await contract.getTotalDelegationFunds();
console.log('LP Funds:', ethers.utils.formatEther(lpFunds));
console.log('Delegation Funds:', ethers.utils.formatEther(delegationFunds));

        setTotalLPFunds(ethers.utils.formatEther(lpFunds));
        setTotalDelegationFunds(ethers.utils.formatEther(delegationFunds));
      } catch (error) {
        console.error('Error fetching LP and delegation funds:', error);
      }
    }
  }, [contract]);
  

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
        const etherAmountInWei = ethers.utils.parseEther(isPresale ? '871' : regularCost);
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
      fetchLPAndDelegationFunds();
       getNFTRewards();
    }

    initialize();
  }, [fetchLPAndDelegationFunds, getNFTRewards]);

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
        <p className="nft-retro-paragraph">
  <strong>Connected Address:</strong> {connectedAddress}
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
          <strong> NFT Reward Percentage: 16%</strong><br />
          <strong> 7% Liquidity allocation to Psycho Gems Token: Liquidity will not be added until consulted with community and voted in </strong><br /><br />
          <strong> 7% Delegation allocation to best FTSO: Delegation rewards dispersed to holders monthly,</strong>
          <strong> Delegation Pot will continue to get added to over time</strong><br />
          <strong>Presale Cost: 871 SGB</strong><br />
          <p>
            PreSale lasts up to 1000 NFTs minted<br />
          </p>
          <strong>Post Presale Cost: 1742 SGB </strong><br />
        </p>

       
  
        <p className="nft-retro-paragraph">
          <strong>Step 3: Mint Your NFTs</strong><br />
          Choose the number of NFTs you wish to mint. Remember, there's a limit on how many you can mint in one transaction.
        </p>
       
  
        <p className="nft-retro-paragraph">
  <strong>Step 4: Use a Referral Code (Optional)</strong><br />
  A referral code in our platform is the wallet address of the person who referred you to our NFT minting service. When you use a referral code while minting NFTs, rewards are distributed as follows:
  <ul>
    <li><strong>For the Referrer (whose wallet address is used):</strong> They receive 100 Songbird for each NFT you mint. This reward is a token of our appreciation for them introducing new users to our platform.</li>
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
<div className='nft-retro-paragraph'>
<p>
 Presale Active: {isPresale ? 'Yes' : 'No'}<br />
          <strong>Current Cost: {currentCost} </strong><br />

          </p>
          <strong>Total Supply: {totalSupply} out of 10000 </strong><br />

          </div>
          <label className="nft-retro-input-label">
          Mint Amount:
          <div className="nft-retro-mint-amount">
            <button className="nft-retro-button-right" onClick={decreaseMintAmount}>-</button>
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="nft-retro-input"
              style={{ inputMode: 'none' }}
            />
            <button className="nft-retro-button-left" onClick={increaseMintAmount}>+</button>
          </div>
        </label>
        <button className="nft-retro-button" onClick={mintNFTs}>
          {isPresale ? 'Mint NFTs (Presale)' : 'Mint NFTs (Regular)'}
        </button>
  
        <p className="nft-retro-paragraph">
          <strong>Step 5: Claim Your Rewards</strong><br />
          If you've earned NFT rewards, use the button below to claim them. Ensure you're connected to the correct Songbird account.
          <h1><strong>Accumulated NFT Rewards: {nftRewards} SGB </strong> </h1>

        </p>
        <button className="nft-retro-button" onClick={claimRewards}>
          Claim Rewards
        </button>
        <p className="lp-container">
        <h2>Fund Details</h2>
        <p>LP Fund Percentage: 7%</p>
        <p>LP funds are used to provide liquidity for the Psy/SGB pair</p>
        <p>LP funds will be community controlled buying</p>
        <p>Delegation Fund Percentage: 7%</p>
        <p>Delegation funds are used to delegate to the best FTSO on the Songbird network</p>
        <p>Delegation funds are dispersed to holders monthly</p>

        <p> <strong>Total LP Funds: {totalLPFunds} SGB</strong></p>
        <p> <strong>Total Delegation Funds: {totalDelegationFunds} SGB </strong></p>
      </p>
      </div>
    </div>
  );
  
  
  
}

export default NFTMintingComponent;
