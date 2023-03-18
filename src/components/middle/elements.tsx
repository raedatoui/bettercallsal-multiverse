import styled from 'styled-components';
import { NavButton } from 'src/styles/sharedstyles';
import { glowShadow } from 'src/utils/animations';
import { breakPoints, CDN } from 'src/constants';

export const MiddleSection = styled.div`
    position: relative;
    outline: none;
    width: 66.6666666667%;
    &.gallery {
      width: 100%;
    }
    @media only screen and (max-width: ${breakPoints.lg1.max}px) {
        width: 100%;
    }
`;

export const Caption = styled.h4`
  color: rgb(253, 0, 0);
  text-transform: uppercase;
  margin: auto;
  text-shadow: 2px 2px white, -2px -2px white, 2px -2px white, -2px 2px white;
  text-align: center;
  font-size: 2em;
  padding-top: 10px;
  width: 100%;

  @media only screen and (max-width: ${breakPoints.sm.max}px) {
    font-size: 2em;
  }
`;

export const Quote = styled.h6`
    color: #353521;
    text-transform: uppercase;
    font-size: 20px;
    text-decoration: none;
    padding-bottom: 10px;
    font-style: italic;
    margin-bottom: 0;
`;

export const ContentList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  &.off {
    display: none;
  }

  @media only screen and (max-width: 420px) {
    grid-template-columns: repeat(1, 1fr);
  }
    
  @media only screen and (min-width: 421px) and (max-width: 620px) {
    grid-template-columns: repeat(2, 1fr);
  }
    
  @media only screen and (min-width: 621px) and (max-width: ${breakPoints.lg1.max}px) {
    grid-template-columns: repeat(3, 1fr);
  }
    
  @media only screen and (min-width: ${breakPoints.lg2.min}px) and (max-width: 849px) {
    grid-template-columns: repeat(3, 1fr);
  }
    
  @media only screen and (min-width: 850px) and (max-width: 1023px) {
    grid-template-columns: repeat(3, 1fr);
  }
    
  @media only screen and (min-width: 1024px) and (max-width: ${breakPoints.lg2.max}px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const ContentItem = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  position: relative;
  
  &:hover {
    transition: all 0.1s ease-in;
    box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(234, 228, 31, 0.19);
  }
  
  img {
    object-fit: contain;
    cursor: pointer;
    width: 100% !important;
    position: relative !important;
    height: unset !important;
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
  top: 0;
  left: 0;
  z-index: 2;
  display: none;
  &.loaded {
    display: block;
    //flex-direction: column;
  }
  
  img {
    object-fit: contain;
    margin: 0 auto;
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;

  &:hover {
    div {
      display: flex;
    }
  }

  .keen-slider__slide {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .keen-slider__slide img {
    position: absolute;
    transition: opacity 1s ease-in;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
`;

export const ImageOverlay = styled.div<{ width: number, height: number }>`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  position: absolute;
  top: 0;
  left: 0;

  //background-color: rgba(0,0,0,0.75);
  display: none;
  
  img {
    object-fit: contain;
    max-width: 32px;
    max-height: 32px;
    position: absolute;
    left: calc(50% - 32px);
    top: calc(50% - 32px);
  }
`;

export const Player = styled.div<{ width: number, height: number }>`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  margin: 0 auto;
  display: block;


  iframe {
    width: ${props => `${props.width}px`} !important;
    height: ${props => `${props.height}px`} !important;
  }
  
  &.hide {
    display: none;
  }
`;

export const Video = styled.video<{ width: number, height: number, left: number }>`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  left: ${props => `${props.left}px`};
  position: absolute;
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
  padding: 10px 70px;
  margin-bottom: 0;
  color: white;
  text-transform: uppercase;
  text-shadow: 2px 2px #F63361,
    -2px -2px #F63361,
    2px -2px #F63361,
  -2px 2px #F63361;
  font-size: 2em;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  text-align: center;
  overflow-wrap: break-word;

  @media only screen and (max-width: ${breakPoints.sm.max}px) {
    padding: 34px 0 0 0;
    
    &.lower {
      padding: 0;
    }
  }
`;

export const ButtonBar = styled.div`
  top: 5px;
  right: 5px;
  position: absolute;
  display: flex;
`;

export const StopButton = styled(NavButton)`
  height: 30px;
  line-height: 32px;
  padding: 0 10px;
  
  img {
     margin-top: 2px;
  }
`;

export const GameButtonBar = styled(ButtonBar)<{ left: number, top: number }>`
  top: ${props => `${props.top - 32}px`};
  left: ${props => `${props.left}px`};
  position: absolute;
`;

export const GameCanvas = styled.canvas<{ width: number, height: number, left: number }>`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  margin-left: ${props => `${props.left}px`};
  background: #231F20;
  &.off {
    display: none;
  }
`;

export const GameImageContainer = styled.div<{ width: number, height: number }>`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  position: relative;
  margin: 0 auto;
  cursor: pointer;
  img {
    position: absolute;
    top: 0;
    left: 0;
    
    &.glowy {
      animation: ${glowShadow} 1.5s linear infinite alternate;
    }
  }
`;

export const EcardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  
  img {
    margin: 12px;
  }
`;

export const LoadingBar = styled.div`
  position: absolute; 
  left: 50%; 
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const LoadingBarProgressEmpty = styled.div`
  width: 141px; 
  height: 18px; 
  margin-top: 10px; 
  background: url(${() => `${CDN}/unity/progress-bar-empty-dark.png`}) no-repeat center
`;

export const LoadingBarProgressFull = styled.div<{ width: number }>`
  width: ${props => `${props.width}%`};
  height: 18px; 
  margin-top: 10px;
  background: url(${() => `${CDN}/unity/progress-bar-full-dark.png`}) no-repeat center
`;
