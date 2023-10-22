import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "../styles/Rewards.scss";

const contractAddress = "0xb7bb1792BBfabbA361c46DC5860940e0E1bFb4b9";
const contractABI = [
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "nftHolderRewards",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

function Rewards() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [userReward, setUserReward] = useState(0);

  useEffect(() => {
    async function setupWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        setWeb3(web3);
        setContract(contract);
      }
    }
    setupWeb3();
  }, []);

  useEffect(() => {
    async function fetchUserReward() {
      if (contract && web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          const userAddress = accounts[0];
          const userReward = await contract.methods.nftHolderRewards(userAddress).call();
          setUserReward(userReward);
        }
      }
    }
    fetchUserReward();
  }, [contract, web3]);

  const claimReward = async () => {
    if (contract) {
      try {
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.claimReward().send({
          from: accounts[0],
        });
        console.log(result);
        alert("Reward claimed successfully!");
        setUserReward(0); // Update the displayed reward after claiming
      } catch (error) {
        console.error("Error claiming reward:", error);
        alert("Error claiming reward. Please check your wallet and try again.");
      }
    }
  };

  return (
    <div className="rewards-container">
      <h2>Claim Your Rewards</h2>
      {web3 ? (
        <div>
          <p>Your Accumulated Reward: {userReward} ETH</p>
          <button onClick={claimReward} className="claim-button">
            Claim Reward
          </button>
        </div>
      ) : (
        <p>Please connect your wallet to claim rewards</p>
      )}
    </div>
  );
}

export default Rewards;
