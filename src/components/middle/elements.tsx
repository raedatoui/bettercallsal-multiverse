import styled, { keyframes } from 'styled-components';
import { NavButton } from 'src/styles/sharedstyles';

export const MiddleSection = styled.div`
    padding-top: 15px;
    position: relative;
    overflow: visible;
    @media only screen and (min-width: 1024px) {
        width: calc(100% - 500px);
    }
    
    @media only screen and (max-width: 1023px) {
        width: 100%;
    }
`;

export const Caption = styled.h5`
  color: rgb(253, 0, 0);
  text-transform: uppercase;
  margin: auto;
  text-shadow: 2px 2px white, -2px -2px white, 2px -2px white, -2px 2px white;
  text-align: center;
  font-size: 30px;
`;

export const Quote = styled.h6`
    color: #353521;
    text-transform: uppercase;
    font-size: 20px;
    text-decoration: none;
    margin: 10px auto 0 auto;
    padding: 0 5px;
    font-style: italic;
`;

export const ContentList = styled.div`
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;

    @media only screen and (max-width: 480px) {
        grid-template-columns: auto;
    }
    
    @media only screen and (max-width: 399px) {
        grid-template-columns: repeat(1, 1fr);
    }

    @media only screen and (min-width: 400px) and (max-width: 620px) {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @media only screen and (min-width: 621px) and (max-width: 1023px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media only screen and (min-width: 1024px) and (max-width: 1199px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const rotateAnimation = keyframes`
    from {transform: rotateY(0deg);}
    to {transform: rotateY(3600deg);}
`;

export const ContentItem = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  &:hover {
    transition: all 0.1s ease-in;
    box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(234, 228, 31, 0.19);
  }
  
  img {
    object-fit: cover;
    cursor: pointer;
    width: 100%;
  }
`;

export const ContentItemTitle = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-size: 16px;
  color: rgb(253, 0, 0);
  padding: 5px 0;
`;

export const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(254, 161, 0, 0.95);
  z-index: 2;
  display: none;
  &.loaded {
    display: block;
  }
`;

export const Player = styled.div`
  max-width: 720px;
  max-height: 576px;
  margin: 0 auto;
  display: block;
  width: 100%;

  iframe {
    width: 100% !important;
    height: 480px !important;
  }
  
  &.hide {
    display: none;
  }
`;

export const Bar = styled.div`
  margin: 20px 0;
  display: flex;
  width: 100%;
  align-content: center;
  flex-direction: row;
  justify-content: space-around;
`;

export const VideoText = styled.h5`
  margin: 10px 0;
  color: white;
  text-transform: uppercase;
  text-shadow: 2px 2px #F63361,
    -2px -2px #F63361,
    2px -2px #F63361,
  -2px 2px #F63361;
  font-size: 30px;
`;

export const StopButton = styled(NavButton)`
  height: 30px;
  width: 100px;
  line-height: 32px;
  top: 10px;
  right: 10px;
  position: absolute;
`;
