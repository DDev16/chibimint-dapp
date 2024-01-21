import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NFTContractABI from '../abi/contractabi.json';
import "../styles/MyNFTs.scss"

function MyNFTs() {
  const contractAddress = '0xa3055a9Ac1Be0f978d8DD860C9f20BcFe15BF120'; // Replace with your contract address

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
  
          // Get the number of NFTs owned by the connected address
          const balance = await nftContract.balanceOf(connectedAddress);
  
          let ownedNFTs = [];
          for (let i = 0; i < balance; i++) {
            const tokenId = await nftContract.tokenOfOwnerByIndex(connectedAddress, i);
            // Construct the image URI as per your format
            const imageURI = `https://ipfs.io/ipfs/bafybeidjgv5osvyogglerak62of77onccyss5neb2xocklwhgjozl5ne4u/${tokenId}.png`;
            ownedNFTs.push({ tokenId: tokenId.toString(), imageURI });
          }
  
          setNFTs(ownedNFTs);
        } catch (error) {
          console.error('Error connecting wallet and fetching NFTs:', error);
        }
      }
    }
  
    connectToEthereum();
  }, [contractAddress, contract]);
  

  

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
