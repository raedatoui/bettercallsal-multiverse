import styled from 'styled-components';

const Main = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Section = styled.section`
    display: flex;
    flex-flow: column;
`;

const MainSection = styled(Section)`
  box-sizing: border-box;
  height: 100%;
  @media only screen and (max-width: 1024px) {
      height: initial;
  }
`;

const Row = styled.div`
    background-image: -webkit-linear-gradient(#fea100, #eae41f, #eae41f, #eae41f);
    background-image: -o-linear-gradient(#fea100, #eae41f, #eae41f, #eae41f);
    background-image: linear-gradient(#fea100, #eae41f, #eae41f, #eae41f);
    display: flex;
    position: relative;
    flex: 1;
    overflow: auto;
    @media only screen and (max-width: 1023px) {  
        flex-direction: column;
    }
`;

const NavButton = styled.div`
  font-family: Pragmatica, Arial, Helvetica, sans-serif;
  font-size: 20px;
  text-transform: uppercase;
  font-stretch: expanded;
  font-weight: bold;
  color: #232323;
  text-align: center;
  cursor: pointer;
  background: -moz-linear-gradient(top, #eae41f 0%, #fea100);
  background: -webkit-gradient(linear, left top, left bottom, from(#eae41f), to(#fea100));
  border-radius: 7px;
  border: 1px solid #fff;
  box-shadow:
          0 1px 3px rgba(000, 000, 000, 0.5),
          inset 0 0 1px rgba(255, 255, 255, 0.7);
  text-shadow:
            0 -1px 0 rgba(000, 000, 000, 0.4),
          0 1px 0 rgba(255, 255, 255, 0.3);
  
  &:hover, &.selected {
    cursor: pointer;
    background: -moz-linear-gradient(top, #d1cb06 0%, #e58800);
    background: -webkit-gradient(linear, left top, left bottom, from(#d1cb06), to(#e58800));
    border: 1px solid #fff;
  }
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 1100;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(254, 161, 0, 0.95);
  z-index: 1200;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;


  img {
    object-fit: contain;
  }
`;

export { Main, MainSection, Row, NavButton, StickyContainer, Overlay };
