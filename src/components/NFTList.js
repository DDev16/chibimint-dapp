import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NFTContractABI from '../abi/contractabi.json';
import "../styles/MyNFTs.scss"

function MyNFTs() {
  const contractAddress = '0x82e01223d51Eb87e16A03E24687EDF0F294da6f1'; // Replace with your contract address

  const [connectedWallet, setConnectedWallet] = useState(null);
  const [nfts, setNFTs] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function connectToEthereum() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.enable();
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, NFTContractABI, signer);
          setContract(nftContract);
          
          const connectedAddress = await signer.getAddress();
          setConnectedWallet(connectedAddress);

          const tokenIdsWithBaseURI = await nftContract.walletOfOwnerWithBaseURI(connectedAddress);

          const nftData = await Promise.all(
            tokenIdsWithBaseURI.map(async (item) => {
              const tokenId = item[0]; // Extract the token ID
              const imageURI = `https://ipfs.io/ipfs/bafybeih6ocvp4vmuibfe2xvuvjjujdi5fi7bb4aylvvakrvejztmuwx7ee/${tokenId}.png`;
              return { tokenId: tokenId.toString(), imageURI };
            })
          );

          setNFTs(nftData);
        } catch (error) {
          console.error('Error connecting wallet and fetching NFTs:', error);
        }
      }
    }

    connectToEthereum();
  }, [contractAddress, NFTContractABI]);

  

  return (
      <div className="content-container"> 
        {connectedWallet ? (
          <div>
            <h2 className="wallet-address">Connected Wallet Address: {connectedWallet}</h2>
            <h3>Your NFTs</h3>
            <div className="nft-container">
              {nfts.map((nft) => (
                <div key={nft.tokenId} className="nft-item">
                  <h4>Token ID: {nft.tokenId}</h4>
                  <img src={nft.imageURI} alt={`NFT ${nft.tokenId}`} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="message">Please connect your wallet to view your NFTs.</p>
        )}
      </div>
  );
}

export default MyNFTs;
