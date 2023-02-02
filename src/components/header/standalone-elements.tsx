import styled from 'styled-components';

export const StandaloneHeaderContainer = styled.header`
  width: 100%;
  font-size: 80px;
  margin: auto;
  color: white;
  -webkit-transform-style: flat;
  transform-style: flat;
  background-image: linear-gradient(#FD9F00, #FBFA00);
  box-shadow: inset 0 0 100px hsla(0, 0%, 0%, .3);
  height: 240px;
  position: relative;
  transform: scale(1.55);

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
  
  .left {
    margin-left: 20%;
  }
  .right {
    margin-right: 20%;
  }
`;

export const StandaloneTickerContainer = styled.div<{ background: string }>`{
  display: flex;
  background-color: ${props => props.background};
  position: relative;
}`;

export const StandaloneFiller = styled.div`
 height: 168px;   
`;
