import { createGlobalStyle } from 'styled-components';
import { breakPoints } from 'src/constants';

const GlobalStyle = createGlobalStyle`
  body,
  html {
    font-family: Pragmatica, Arial, Helvetica, sans-serif;
    height: 100%;
    width: 100%;
  }

  body {
    background-color: #eae41f;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    overflow-x: hidden;
    overflow-y: hidden;

    @media only screen and (max-width: ${breakPoints.sm.max}px) {
      overflow-y: auto;
      height: auto;
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
