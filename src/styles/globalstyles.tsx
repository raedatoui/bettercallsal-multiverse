import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body,
  html {
    font-family: Pragmatica, Arial, Helvetica, sans-serif;
    height: 100%;
  }

  body {
    background-color: #eae41f;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: #fff;
    font-weight: bold;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    text-align: center;
  }

  #soundcloud {
    max-width: 500px;
    margin: auto;
  }

  #sc-artwork {
    background-size: cover;
    background-position: 50% 50%;
    background-image: url(../images/salsc-small.jpg);
    height: 580px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
  }

  #particles {
    width: 100%;
    background-color: rgba(255, 255, 255, 0);
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    display: none;
  }
`;

export default GlobalStyle;
