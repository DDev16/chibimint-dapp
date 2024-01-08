import React from 'react';
import styled from 'styled-components';
import videoSrc from '../assets/video.mp4'; // Adjust the path based on your project structure


const StyledVideo = styled.video`
   width: 100%;
  height: auto;
  object-fit: cover;
`;

const VideoHero = ({ autoPlay = true, loop = true, muted = true }) => {
  return (
    <StyledVideo src={videoSrc} autoPlay={autoPlay} loop={loop} muted={muted} />
  );
};

export default VideoHero;
