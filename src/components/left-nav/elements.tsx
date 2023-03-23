import styled from 'styled-components';
import { NavButton } from 'src/styles/sharedstyles';
import { breakPoints } from 'src/constants';

export const LeftNavContainer = styled.div`
  width: 16.6666666667%;
  &.on {
    display: block;
  }

  &.off {
    display: none;
  }
  
  @media only screen and (max-width: ${breakPoints.lg1.max}px) {
    order: 1;
    width: 100%;
  }
`;

export const LeftNavMenu = styled.div`
  padding: 8px 0 26px 0;
  width: 100%;
  background-color: #4b7aa3;
`;

export const LeftNavButton = styled(NavButton)`
  margin: 8px 6px 8px 0;
  border-radius: 0 4px 4px 0 !important;
  text-align: left;
  height: 38px;
  line-height: 38px;
  text-align: left  !important;
  padding: 0 6px;

  a {
    color: inherit;
    text-decoration: none;
  }
  
  &:first-of-type {
    margin-top: 0;
  }
  
  &:last-of-type {
    margin-bottom: 0;
  }

  @media only screen and (min-width: ${breakPoints.lg2.min}px) and (max-width: 900px) {
    padding: 0 3px;
  }
`;

export const LeftNavItemCuck = styled.div`
  width: 100%;
  height: 100%;
`;

export const LeftAdd = styled.div`
  box-sizing: border-box;
  max-width: 600px;
  margin: 0 auto;
`;

export const LeftAdd1 = styled(LeftAdd)`
  border: solid 8px rgb(255, 111, 0);
  cursor: pointer;

  @media only screen and (max-width: ${breakPoints.lg1.max}px) {
    border: solid 14px rgb(255, 111, 0);
  }

  @media only screen and (min-width: ${breakPoints.lg2.min}px) and (max-width: 1009px) {
    border: solid 6px rgb(255, 111, 0);
  }
`;

export const LeftAdd2 = styled(LeftAdd)`
  border: solid 8px rgb(228, 0, 196);
  width: 100%;
  position: relative;

  &::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }

  span {
    position: absolute;
    bottom: -22px;
    left: 0;
    margin: 0 auto;
    text-transform: uppercase;
    font-size: 1.3em;
    color: #eae41f;
    width: 100%;
    text-align: center;
    letter-spacing: 2px;
    text-shadow:
              rgb(228, 0, 196) -3px -3px 0,
              rgb(228, 0, 196) -3px -1px 0,
              rgb(228, 0, 196) -3px 0 0,
              rgb(228, 0, 196) -3px 1px 0,
              rgb(228, 0, 196) -3px 3px 0,
              rgb(228, 0, 196) -1px -3px 0,
              rgb(228, 0, 196) -1px -1px 0,
              rgb(228, 0, 196) -1px 0 0,
              rgb(228, 0, 196) -1px 1px 0,
              rgb(228, 0, 196) -1px 3px 0,
              rgb(228, 0, 196) 0 -3px 0,
              rgb(228, 0, 196) 0 -1px 0,
              rgb(228, 0, 196) 0 0 0,
              rgb(228, 0, 196) 0 1px 0,
              rgb(228, 0, 196) 0 3px 0,
              rgb(228, 0, 196) 1px -3px 0,
              rgb(228, 0, 196) 1px -1px 0,
              rgb(228, 0, 196) 1px 0 0,
              rgb(228, 0, 196) 1px 1px 0,
              rgb(228, 0, 196) 1px 3px 0,
              rgb(228, 0, 196) 3px -3px 0,
              rgb(228, 0, 196) 3px -1px 0,
              rgb(228, 0, 196) 3px 0 0,
              rgb(228, 0, 196) 3px 1px 0,
              rgb(228, 0, 196) 3px 3px 0;

    @media only screen and (max-width: 800px) and (min-width: 768px) {
      font-size: 0.6em;
      text-shadow:
                rgb(228, 0, 196) -2px -2px 0,
                rgb(228, 0, 196) -2px -1px 0,
                rgb(228, 0, 196) -2px 0 0,
                rgb(228, 0, 196) -2px 1px 0,
                rgb(228, 0, 196) -2px 2px 0,
                rgb(228, 0, 196) -1px -2px 0,
                rgb(228, 0, 196) -1px -1px 0,
                rgb(228, 0, 196) -1px 0 0,
                rgb(228, 0, 196) -1px 1px 0,
                rgb(228, 0, 196) -1px 2px 0,
                rgb(228, 0, 196) 0 -2px 0,
                rgb(228, 0, 196) 0 -1px 0,
                rgb(228, 0, 196) 0 0 0,
                rgb(228, 0, 196) 0 1px 0,
                rgb(228, 0, 196) 0 2px 0,
                rgb(228, 0, 196) 1px -2px 0,
                rgb(228, 0, 196) 1px -1px 0,
                rgb(228, 0, 196) 1px 0 0,
                rgb(228, 0, 196) 1px 1px 0,
                rgb(228, 0, 196) 1px 2px 0,
                rgb(228, 0, 196) 2px -2px 0,
                rgb(228, 0, 196) 2px -1px 0,
                rgb(228, 0, 196) 2px 0 0,
                rgb(228, 0, 196) 2px 1px 0,
                rgb(228, 0, 196) 2px 2px 0;
    }
    @media only screen and (max-width: 1009px) and (min-width: 801px) {
      font-size: 0.7em;
    }
    
    @media only screen and (max-width: ${breakPoints.lg2.max}px) and (min-width: 1010px) {
      font-size: 1em;
    }
  }

  @media only screen and (max-width: ${breakPoints.lg1.max}px) {
    border: solid 14px rgb(228, 0, 196);
  }
  @media only screen and (min-width: ${breakPoints.lg2.min}px) and (max-width: 1009px) {
    border: solid 6px rgb(228, 0, 196);
  }
`;

export const LeftContent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color:  rgb(228, 0, 196);
  img {
    width: 100%;
  }
`;
