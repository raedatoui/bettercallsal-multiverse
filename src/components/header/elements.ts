/* eslint-disable max-len */
import styled from 'styled-components';
import { breakPoints } from 'src/constants';

export const HeaderContainer = styled.header`
  width: 100%;
  font-size: 80px;
  margin: 0 auto 0 auto;
  color: white;
  -webkit-transform-style: flat;
  transform-style: flat;
  background-image: linear-gradient(#FD9F00, #FBFA00);
  box-shadow: inset 0 0 100px hsla(0, 0%, 0%, .3);
  z-index: 1;

  .content {
    width: 100%;
  }
  @media only screen and (max-width : ${breakPoints.md.max}px) {
    font-size: 40px;
  }
  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
    font-size: 50px;
  }
  @media only screen and (max-width : ${breakPoints.lg2.max}px) and (min-width : ${breakPoints.lg2.min}px) {
    font-size: 60px;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const TickerContainer = styled.div<{ background: string }>`{
  display: flex;
  background-color: ${props => props.background};
  position: relative;
}`;

export const SalHolder = styled.div`
    margin-top: -30px;
`;
