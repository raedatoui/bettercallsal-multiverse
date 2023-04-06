import { createGlobalStyle } from 'styled-components';
import { breakPoints } from 'src/constants';

const GlobalStyle = createGlobalStyle`
  body,
  html {
    font-family: Pragmatica, Arial, Helvetica, sans-serif;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  body {
    background-color: #F13400;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    overflow-x: hidden;
    overflow-y: hidden;

    @media (max-width: ${breakPoints.sm.max}px){
      overflow-y: auto;
    }

    @media (max-height: 600px) {
      overflow-y: auto;
    }

    img.screencap {
      opacity: 0.5;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      display: none;
    }
    
    #text-effect {
      display: none;
    }
  }

  #__next {
    height: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    text-align: center;
  }
`;

export default GlobalStyle;
