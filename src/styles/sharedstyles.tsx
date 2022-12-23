import styled from 'styled-components';

const DefaultDiv = styled.div``;
const Main = styled.main``;

const Section = styled.section`
    display: flex;
    flex-flow: column;
`;

const MainSection = styled(Section)`
  box-sizing: border-box;
  height: 100%;
  @media only screen and (max-width: 1024px) {
    #main-section {
      height: initial;
    }
  }
`;

const Row = styled.div`
    width: 100%;
    height: 100%;
    background-image: -webkit-linear-gradient(#fea100, #eae41f, #eae41f, #eae41f);
    background-image: -o-linear-gradient(#fea100, #eae41f, #eae41f, #eae41f);
    background-image: linear-gradient(#fea100, #eae41f, #eae41f, #eae41f);
`;

// const Title = styled.h1`
//   margin: 0;
//   line-height: 1.15;
//   font-size: 4rem;
//   text-align: center;
//   text-decoration: none;
//
//   a {
//     color: ${({ theme }) => theme.colors.secondary};
//     text-decoration: none;
//     &:hover,
//     :focus,
//     :active {
//       text-decoration: underline;
//     }
//   }
// `;

// const Description = styled.p`
//   text-align: center;
//   line-height: 1.5;
//   font-size: 1.5rem;
// `;
//
// const CodeTag = styled.code`
//   background: #fafafa;
//   border-radius: 5px;
//   margin: 0 0.75rem;
//   padding: 0.75rem;
//   font-size: 1.1rem;
//   font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
//     Bitstream Vera Sans Mono, Courier New, monospace;
// `;

export { Main, MainSection, Row, DefaultDiv };
