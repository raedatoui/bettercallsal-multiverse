/* eslint-disable max-len */
import styled, { keyframes } from 'styled-components';

export const LawBreakersContainer = styled.div`
  background-image: linear-gradient(#fda810, #eae41f);
  padding: 8px 0;
  border-top: solid 2px #fda810;
  border-bottom: solid 2px gray;
  cursor: pointer;
  display: flex;
  flex-flow: column;
`;

export const borderAnim = keyframes`
    from {
        text-shadow: #a2b3a0 -4px -4px 0, #a2b3a0 -4px -2px 0, #a2b3a0 -4px 0 0, #a2b3a0 -4px 2px 0, #a2b3a0 -4px 4px 0, #a2b3a0 -2px -4px 0, #a2b3a0 -2px -2px 0, #a2b3a0 -2px 0 0, #a2b3a0 -2px 2px 0, #a2b3a0 -2px 4px 0, #a2b3a0 0 -4px 0, #a2b3a0 0 -2px 0, #a2b3a0 0 0 0, #a2b3a0 0 2px 0, #a2b3a0 0 4px 0, #a2b3a0 2px -4px 0, #a2b3a0 2px -2px 0, #a2b3a0 2px 0 0, #a2b3a0 2px 2px 0, #a2b3a0 2px 4px 0, #a2b3a0 4px -4px 0, #a2b3a0 4px -2px 0, #a2b3a0 4px 0 0, #a2b3a0 4px 2px 0, #a2b3a0 4px 4px 0;
    }

    to {
        text-shadow: #fff -4px -4px 0, #fff -4px -2px 0, #fff -4px 0 0, #fff -4px 2px 0, #fff -4px 4px 0, #fff -2px -4px 0, #fff -2px -2px 0, #fff -2px 0 0, #fff -2px 2px 0, #fff -2px 4px 0, #fff 0 -4px 0, #fff 0 -2px 0, #fff 0 0 0, #fff 0 2px 0, #fff 0 4px 0, #fff 2px -4px 0, #fff 2px -2px 0, #fff 2px 0 0, #fff 2px 2px 0, #fff 2px 4px 0, #fff 4px -4px 0, #fff 4px -2px 0, #fff 4px 0 0, #fff 4px 2px 0, #fff 4px 4px 0;
    }
`;

export const LawBreakersP = styled.div`
  text-transform: uppercase;
  text-align: center;
  font-family: Impact, Arial, Helvetica, sans-serif;
  letter-spacing: 4px;
  font-size: 54px;
  height: 90px;
  margin: 0 auto;
  color: #d61d00;
  text-shadow: #fff -4px -4px 0, #fff -4px -2px 0, #fff -4px 0 0, #fff -4px 2px 0, #fff -4px 4px 0, #fff -2px -4px 0, #fff -2px -2px 0, #fff -2px 0 0, #fff -2px 2px 0, #fff -2px 4px 0, #fff 0 -4px 0, #fff 0 -2px 0, #fff 0 0 0, #fff 0 2px 0, #fff 0 4px 0, #fff 2px -4px 0, #fff 2px -2px 0, #fff 2px 0 0, #fff 2px 2px 0, #fff 2px 4px 0, #fff 4px -4px 0, #fff 4px -2px 0, #fff 4px 0 0, #fff 4px 2px 0, #fff 4px 4px 0;
  animation: ${borderAnim} 1.5s linear infinite alternate;
  
  img {
    height: 100%;
    margin: 0 40px;
    vertical-align: middle;
    object-fit: contain;
    
    &.flipped {
      transform: scaleX(-1);
    }
  }
  
  span {
    vertical-align: middle;
  }
`;

export const FooterContainer = styled.footer`
  height: 35px;
  line-height: 35px;
  background-color: #F13400;
  font-size: 80px;

  h2 {
    height: 35px;
    line-height: 35px;
    background-color: #F13400;
    text-transform: uppercase;
    color: #DCDB00;
    font-size: 0.3635em;
    margin: 0 auto;
    letter-spacing: 8px;
    
    a {
      text-decoration: none;
      color: inherit;

      &:hover {
        color: inherit;
      }
    }
  }
`;
