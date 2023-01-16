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
`;

export default GlobalStyle;
