import React, { useEffect, useState } from 'react';

function NFTList() {
  const [nftList, setNFTList] = useState([]);

  useEffect(() => {
    // Fetch the user's NFT collection from the smart contract
  }, []);

  return (
    <div>
      <h1>My NFTs</h1>
      <ul>
        {nftList.map((nft, index) => (
          <li key={index}>{nft.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default NFTList;
