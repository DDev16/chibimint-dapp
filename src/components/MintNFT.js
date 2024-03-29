import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import NFTContractABI from "../abi/contractabi.json";
import Swal from "sweetalert2";
import "../styles/Mint.scss";
import ProgressBar from "../components/ProgressBar.js";

function NFTMintingComponent() {
  const [contract, setContract] = useState(null);
  const [mintAmount, setMintAmount] = useState(1);
  const [isPresale, setIsPresale] = useState(false);
  const [currentCost, setCurrentCost] = useState("");
  const [regularCost, setRegularCost] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [nftRewards, setNftRewards] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [connectedAddress, setConnectedAddress] = useState("");
  const [totalLPFunds, setTotalLPFunds] = useState("");
  const [totalDelegationFunds, setTotalDelegationFunds] = useState("");
  const [totalFreeClaims, setTotalFreeClaims] = useState(0);

  const contractAddress = "0xa3055a9Ac1Be0f978d8DD860C9f20BcFe15BF120";

  async function connectToEthereum() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddress,
          NFTContractABI,
          signer
        );
        setContract(nftContract);

        const presaleStatus = await nftContract.presaleActive();
        const presaleCost = ethers.utils.formatEther(
          await nftContract.presaleCost()
        );
        setIsPresale(presaleStatus);
        setCurrentCost(presaleStatus ? `${presaleCost} SGB` : "3285 SGB");

        const regularCost = ethers.utils.formatEther(
          await nftContract.regularCost()
        );
        setRegularCost(regularCost);

        const totalSupply = await nftContract.totalSupply();
        setTotalSupply(totalSupply.toString());

        const connectedAddress = await signer.getAddress(); // Get the connected address
        setConnectedAddress(connectedAddress); // Set the connected address state

        setIsConnected(true);

        Swal.fire({
          title: "Connected to Songbird",
          text: "You are now connected to Songbird and you can interact with the Psycho Chibi NFT contract.",
          icon: "success",
          customClass: {
            popup: "swal2-popup", // Your custom class for the popup
            title: "swal2-title", // Your custom class for the title
          },
        });
      } catch (error) {
        console.error("Error connecting to Ethereum:", error);

        Swal.fire({
          title: "Error",
          text: "An error occurred while connecting to Ethereum.",
          icon: "error",
          customClass: {
            popup: "swal2-popup", // Your custom class for the popup
            title: "swal2-title", // Your custom class for the title
          },
        });
      }
    } else {
      console.log("MetaMask or a similar provider not detected");

      Swal.fire({
        title: "Info",
        text: "MetaMask or a similar provider is not detected.",
        icon: "info",
        customClass: {
          popup: "swal2-popup", // Your custom class for the popup
          title: "swal2-title", // Your custom class for the title
        },
      });
    }
  }

  const fetchLPAndDelegationFunds = useCallback(async () => {
    if (contract) {
      try {
        const lpFunds = await contract.getTotalLPFunds();
        const delegationFunds = await contract.getTotalDelegationFunds();
        console.log("LP Funds:", ethers.utils.formatEther(lpFunds));
        console.log(
          "Delegation Funds:",
          ethers.utils.formatEther(delegationFunds)
        );

        setTotalLPFunds(ethers.utils.formatEther(lpFunds));
        setTotalDelegationFunds(ethers.utils.formatEther(delegationFunds));
      } catch (error) {
        console.error("Error fetching LP and delegation funds:", error);
      }
    }
  }, [contract]);

  const fetchTotalFreeClaims = useCallback(async () => {
    if (contract) {
      try {
        const freeClaims = await contract.totalFreeClaims();
        setTotalFreeClaims(freeClaims.toNumber());
      } catch (error) {
        console.error("Error fetching total free claims:", error);
      }
    }
  }, [contract]);
  

  const getNFTRewards = useCallback(async () => {
    if (contract) {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(
            contractAddress,
            NFTContractABI,
            signer
          );

          const connectedAddress = signer.getAddress();
          console.log("Connected Address:", connectedAddress);

          const rewards = await nftContract.nftholderRewards(connectedAddress);
          const rewardsInEther = ethers.utils.formatEther(rewards);

          console.log("NFT Rewards:", rewardsInEther);

          setNftRewards(rewardsInEther);
        } else {
          console.error("Ethereum provider not detected");
        }
      } catch (error) {
        console.error("Error getting NFT rewards:", error);
      }
    }
  }, [contract]);

  async function claimRewards() {
    if (contract) {
      try {
        const tx = await contract.claimRewards();
        await tx.wait();

        Swal.fire({
          title: "Success",
          text: "Rewards claimed successfully.",
          icon: "success",
          customClass: {
            popup: "swal2-popup", // Your custom class for the popup
            title: "swal2-title", // Your custom class for the title
          },
        });
      } catch (error) {
        console.error("Error claiming rewards:", error);

        Swal.fire({
          title: "Error",
          text: "An error occurred while claiming rewards.",
          icon: "error",
          customClass: {
            popup: "swal2-popup", // Your custom class for the popup
            title: "swal2-title", // Your custom class for the title
          },
        });
      }
    }
  }

  async function mintNFTs() {
    if (contract) {
      try {
        const etherAmountInWei = ethers.utils.parseEther(
          isPresale ? "2150" : regularCost
        );
        const totalCostInWei = etherAmountInWei.mul(mintAmount);

        const referralAddress = referralCode
          ? ethers.utils.getAddress(referralCode)
          : ethers.constants.AddressZero;

        const tx = await contract.mintWithReferral(
          mintAmount,
          referralAddress,
          { value: totalCostInWei }
        );
        await tx.wait();

        Swal.fire({
          title: "Success",
          text: `${mintAmount} NFTs minted successfully. Total cost: ${ethers.utils.formatEther(
            totalCostInWei
          )} Ether`,
          icon: "success",
          customClass: {
            popup: "swal2-popup", // Your custom class for the popup
            title: "swal2-title", // Your custom class for the title
          },
        });
      } catch (error) {
        console.error("Error minting NFTs:", error);

        Swal.fire({
          title: "Error",
          text: "An error occurred while minting NFTs.",
          icon: "error",
          customClass: {
            popup: "swal2-popup", // Your custom class for the popup
            title: "swal2-title", // Your custom class for the title
          },
        });
      }
    }
  }

  useEffect(() => {
    async function initialize() {
      fetchLPAndDelegationFunds();
      fetchTotalFreeClaims();

      getNFTRewards();
    }

    initialize();
  }, [fetchLPAndDelegationFunds, getNFTRewards, fetchTotalFreeClaims ]);

  const increaseMintAmount = () => {
    setMintAmount(mintAmount + 1);
  };

  const decreaseMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  const claimFreeNFT = async () => {
    if (!contract) return;
  
    try {
      const tx = await contract.ClaimOneNFT();
      await tx.wait(); // Wait for the transaction to be mined
  
      Swal.fire({
        title: 'Success',
        text: 'Your free NFT has been claimed!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error claiming the free NFT:', error);
  
      let errorMessage = 'An error occurred while claiming your free NFT. Please try again.';
      if (error.reason && error.reason.includes("You have already claimed a free NFT")) {
        errorMessage = 'You have already claimed your free NFT.';
      } else if (error.error && error.error.data && typeof error.error.data.message === 'string' && error.error.data.message.includes("You have already claimed a free NFT")) {
        errorMessage = 'You have already claimed your free NFT.';
      } else if (error.message && error.message.includes("execution reverted: You have already claimed a free NFT")) {
        errorMessage = 'You have already claimed your free NFT.';
      }
  
      Swal.fire({
        title: error.reason ? 'Already Claimed' : 'Error',
        text: errorMessage,
        icon: error.reason ? 'info' : 'error',
      });
    }
  };
  
  

  return (
    <div className="minter-container">
      <div className="nft-retro-container">
        <h1 className="nft-retro-title">Psycho Chibi NFT Minter</h1>
        <p className="nft-retro-paragraph">
          Welcome to the Psycho Chibi NFT Minter! Connect to Songbird, mint your
          unique NFTs, and take advantage of our referral program. Follow the
          steps below to get started.
        </p>
        <p className="nft-retro-paragraph">
          <strong>Connected Address:</strong> {connectedAddress}
        </p>

        {!isConnected && (
          <div>
            <p className="nft-retro-paragraph">
              <strong>Step 1: Connect to Songbird</strong>
              <br />
              To start minting NFTs, please first connect to your Songbird
              wallet using MetaMask or a similar provider.
            </p>
            <button className="nft-retro-button" onClick={connectToEthereum}>
              Connect to Songbird
            </button>
          </div>
        )}

        <p className="nft-retro-paragraph">
          <strong>Step 2: Understand Costs and Rewards</strong>
          <br />
          <strong> NFT Reward Percentage: 15%</strong>
          <br />
          <strong> 7% Liquidity allocation to Psycho Gems Token.</strong>
          <br />
          <br />
          <strong>
            {" "}
            7% Delegation allocation to GoogleCLouds FTSO: Delegation rewards
            dispersed to holders monthly,
          </strong>
          <strong>
            {" "}
            Delegation Pot will continue to get added to over time
          </strong>
          <br />
          <strong>Presale Cost: 2150 SGB</strong>
          <br />
          <p>
            PreSale lasts up to 368 NFTs minted
            <br />
          </p>
          <strong>Post Presale Cost: 3550 SGB </strong>
          <br />
        </p>

        <p className="nft-retro-paragraph">
          <strong>Step 3: Mint Your NFTs</strong>
          <br />
          Choose the number of NFTs you wish to mint. Remember, there's a limit
          of 10 you can mint in one transaction.
        </p>

        <p className="nft-retro-paragraph">
          <strong>Step 4: Use a Referral Code (Optional)</strong>
          <br />A referral code in our platform is the wallet address of the
          person who referred you to our NFT minting service. When you use a
          referral code while minting NFTs, rewards are distributed as follows:
          <ul>
            <li>
              <strong>For the Referrer (whose wallet address is used):</strong>{" "}
              They receive 350 $SGB for each NFT you mint. This reward is a
              token of our appreciation for them introducing new users to our
              platform.
            </li>
            <li>
              <strong>For You (the Referee):</strong> You will be rewarded with
              350 $PSYGEM tokens for each NFT minted using the referral code.
              These tokens serve as a bonus for participating in our referral
              program, enhancing the value of your engagement with our platform.
            </li>
          </ul>
          If someone referred you to us, make sure to enter their wallet address
          in the referral code field before you mint your NFTs. This simple act
          supports our community and rewards those who help it grow.
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
        <div className="nft-retro-paragraph">
          <p>
            Presale Active: {isPresale ? "Yes" : "No"}
            <br />
            <strong>Current Cost: {currentCost} </strong>
            <br />
          </p>
        </div>
        <div className="nft-retro-paragraph">
          <strong>Total Supply: {totalSupply} out of 1568 </strong>
          <br />
          <ProgressBar total={1568} current={Number(totalSupply)} />
        </div>
        <label className="nft-retro-input-label">
          Mint Amount:
          <div className="nft-retro-mint-amount">
            <button
              className="nft-retro-button-right"
              onClick={decreaseMintAmount}
            >
              -
            </button>
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="nft-retro-input"
              style={{ inputMode: "none" }}
            />
            <button
              className="nft-retro-button-left"
              onClick={increaseMintAmount}
            >
              +
            </button>
          </div>
        </label>
        <p className="nft-retro-paragraph">
      <strong>Claim Your Free NFT:</strong> Each wallet is eligible to claim one free NFT. This offer is limited to the first 300 claims.
    </p>
    <div className="remaining-claims">
  <p>Only {300 - totalFreeClaims} Free NFT Claims Left!</p>

</div>
        
          <button className="nft-retro-button" onClick={claimFreeNFT}>
            Claim Your Free NFT
          </button>
       
        <button className="nft-retro-button" onClick={mintNFTs}>
          {isPresale ? "Mint NFTs (Presale)" : "Mint NFTs (Regular)"}
        </button>

        <p className="nft-retro-paragraph">
          <strong>Step 5: Claim Your Rewards</strong>
          <br />
          If you've earned NFT rewards, use the button below to claim them.
          Ensure you're connected to the correct Songbird account.
          <h1>
            <strong>Accumulated NFT Rewards: {nftRewards} SGB </strong>{" "}
          </h1>
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
          <p>
            Delegation funds are used to delegate to the best FTSO on the
            Songbird network
          </p>
          <p>Delegation funds are dispersed to holders monthly</p>

          <p>
            {" "}
            <strong>Total LP Funds: {totalLPFunds} SGB</strong>
          </p>
          <p>
            {" "}
            <strong>Total Delegation Funds: {totalDelegationFunds} SGB </strong>
          </p>
        </p>
      </div>
    </div>
  );
}

export default NFTMintingComponent;
