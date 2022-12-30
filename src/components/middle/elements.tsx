import styled from 'styled-components';

export const MiddleSection = styled.div`
    padding-top: 30px;
    @media only screen and (min-width: 1024px) {
        width: calc(100% - 500px);
    }
    
    @media only screen and (max-width: 1023px) {
        width: 100%;
    }
`;

export const Caption = styled.h4`
      color: rgb(253, 0, 0);
      text-transform: uppercase;
      margin: auto;
      text-shadow: 2px 2px white, -2px -2px white, 2px -2px white, -2px 2px white;
      text-align: center;
      font-size: 30px;
`;

export const Quote = styled.h5`
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

export const ContentItem = styled.div`
  margin: 10px;
  position: relative;
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
  padding: 0 5px;
`;
