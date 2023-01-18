/* eslint-disable max-len */
import styled from 'styled-components';

export const HeaderContainer = styled.header`
  width: 100%;
  font-size: 80px;
  margin: 0 auto 0 auto;
  color: white;
  -webkit-transform-style: flat;
  transform-style: flat;
  background-image: linear-gradient(#FD9F00, #FBFA00);
  box-shadow: inset 0 0 100px hsla(0, 0%, 0%, .3);
  z-index: 1100;
  //position: sticky;
  //top: 0;

  .content {
    width: 100%;
  }
  @media only screen and (max-width : 567px) {
    font-size: 40px;
  }
  @media only screen and (max-width : 1020px) and (min-width : 568px) {
    font-size: 50px;
  }
  @media only screen and (max-width : 1273px) and (min-width : 1021px) {
    font-size: 60px;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const TickerContainer = styled.div<{ background: string }>`{
  width: 100%;
  display: flex;
  background-color: ${props => props.background};
}`;

export const SalHolder = styled.div`
    margin-top: -30px;
`;
