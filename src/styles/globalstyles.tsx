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

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  h1 {
    font-size: 4.0rem;
    line-height: 1.2;
    letter-spacing: -.1rem;
  }

  h2 {
    font-size: 3.6rem;
    line-height: 1.25;
    letter-spacing: -.1rem;
  }

  h3 {
    font-size: 3.0rem;
    line-height: 1.3;
    letter-spacing: -.1rem;
  }

  h4 {
    font-size: 2.4rem;
    line-height: 1.35;
    letter-spacing: -.08rem;
  }

  h5 {
    font-size: 1.8rem;
    line-height: 1.5;
    letter-spacing: -.05rem;
  }

  h6 {
    font-size: 1.5rem;
    line-height: 1.6;
    letter-spacing: 0;
  }

  /* Larger than phablet */
  @media (min-width: 550px) {
    h1 {
      font-size: 5.0rem;
    }

    h2 {
      font-size: 4.2rem;
    }

    h3 {
      font-size: 3.6rem;
    }

    h4 {
      font-size: 3.0rem;
    }

    h5 {
      font-size: 2.4rem;
    }

    h6 {
      font-size: 1.5rem;
    }
  }

  .container {
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .column,
  .columns {
    width: 100%;
    float: left;
    box-sizing: border-box;
  }

  /* For devices larger than 400px */
  @media (max-width: 400px) {
    .container {
      width: 100%;
      padding: 0;
    }
  }

  @media (min-width: 400px) {
    .container {
      width: 100%;
      padding: 0;
    }
  }

  /* For devices larger than 550px */
  @media (min-width: 550px) {
    .container {
      width: 100%;
    }

    .column,
    .columns {
      margin-left: 0;
    }

    .column:first-child,
    .columns:first-child {
      margin-left: 0;
    }
  }

  .one.column,
  .one.columns {
    width: 8.3333333333%;
  }

  .two.columns {
    width: 16.6666666667%;
  }

  .three.columns {
    width: 25%;
  }

  .four.columns {
    width: 33.3333333333%;
  }

  .five.columns {
    width: 41.6666666667%;
  }

  .six.columns {
    width: 50%;
  }

  .seven.columns {
    width: 58.3333333333%;
  }

  .eight.columns {
    width: 66.6666666667%;
  }

  .nine.columns {
    width: 75.0%;
  }

  .ten.columns {
    width: 83.3333333333%;
  }

  .eleven.columns {
    width: 91.6666666667%;
  }

  .twelve.columns {
    width: 100%;
    margin-left: 0;
  }

  .one-third.column {
    width: 33.3333333333%;
  }

  .two-thirds.column {
    width: 66.6666666667%;
  }

  .one-half.column {
    width: 50%;
  }
`;

export default GlobalStyle;
