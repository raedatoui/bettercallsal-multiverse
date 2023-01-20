import { createGlobalStyle } from 'styled-components';

const Skeleton = createGlobalStyle`
  .container {
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0 20px;
    box-sizing: border-box; }
  .column,
  .columns {
    width: 100%;
    float: left;
    box-sizing: border-box; }

  /* For devices larger than 400px */
  @media (max-width: 400px) {
    .container {
      width: 100%;
      padding: 0; }
  }

  @media (min-width: 400px) {
    .container {
      width: 100%;
      padding: 0; }
  }

  /* For devices larger than 550px */
  @media (min-width: 550px) {
    .container {
      width: 100%; }
    .column,
    .columns {
      margin-left: 0; }
    .column:first-child,
    .columns:first-child {
      margin-left: 0; }


    .one.column,
    .one.columns                    { width: 8.3333333333%; }
    .two.columns                    { width: 16.6666666667%; }

    .three.columns                  { width: 25%;            }
    .four.columns                   { width: 33.3333333333%; }
    .five.columns                   { width: 41.6666666667%; }
    .six.columns                    { width: 50%;            }
    .seven.columns                  { width: 58.3333333333%; }
    .eight.columns                  { width: 66.6666666667%; }
    .nine.columns                   { width: 75.0%;          }
    .ten.columns                    { width: 83.3333333333%; }
    .eleven.columns                 { width: 91.6666666667%; }
    .twelve.columns                 { width: 100%; margin-left: 0; }

    .one-third.column               { width: 33.3333333333%; }
    .two-thirds.column              { width: 66.6666666667%; }

    .one-half.column                { width: 50%; }

    /* Offsets */
    .offset-by-one.column,
    .offset-by-one.columns          { margin-left: 8.66666666667%; }
    .offset-by-two.column,
    .offset-by-two.columns          { margin-left: 17.3333333333%; }
    .offset-by-three.column,
    .offset-by-three.columns        { margin-left: 26%;            }
    .offset-by-four.column,
    .offset-by-four.columns         { margin-left: 34.6666666667%; }
    .offset-by-five.column,
    .offset-by-five.columns         { margin-left: 43.3333333333%; }
    .offset-by-six.column,
    .offset-by-six.columns          { margin-left: 52%;            }
    .offset-by-seven.column,
    .offset-by-seven.columns        { margin-left: 60.6666666667%; }
    .offset-by-eight.column,
    .offset-by-eight.columns        { margin-left: 69.3333333333%; }
    .offset-by-nine.column,
    .offset-by-nine.columns         { margin-left: 78.0%;          }
    .offset-by-ten.column,
    .offset-by-ten.columns          { margin-left: 86.6666666667%; }
    .offset-by-eleven.column,
    .offset-by-eleven.columns       { margin-left: 95.3333333333%; }

    .offset-by-one-third.column,
    .offset-by-one-third.columns    { margin-left: 34.6666666667%; }
    .offset-by-two-thirds.column,
    .offset-by-two-thirds.columns   { margin-left: 69.3333333333%; }

    .offset-by-one-half.column,
    .offset-by-one-half.columns     { margin-left: 52%; }

  }
  

  /* Typography
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 2rem;
    font-weight: 300; }
  h1 { font-size: 4.0rem; line-height: 1.2;  letter-spacing: -.1rem;}
  h2 { font-size: 3.6rem; line-height: 1.25; letter-spacing: -.1rem; }
  h3 { font-size: 3.0rem; line-height: 1.3;  letter-spacing: -.1rem; }
  h4 { font-size: 2.4rem; line-height: 1.35; letter-spacing: -.08rem; }
  h5 { font-size: 1.8rem; line-height: 1.5;  letter-spacing: -.05rem; }
  h6 { font-size: 1.5rem; line-height: 1.6;  letter-spacing: 0; }

  /* Larger than phablet */
  @media (min-width: 550px) {
    h1 { font-size: 5.0rem; }
    h2 { font-size: 4.2rem; }
    h3 { font-size: 3.6rem; }
    h4 { font-size: 3.0rem; }
    h5 { font-size: 2.4rem; }
    h6 { font-size: 1.5rem; }
  }


`;

export default Skeleton;
