import styled from 'styled-components';
import { NavButton } from 'src/styles/sharedstyles';

export const LeftNavContainer = styled.div`
    min-width: 250px;
    width: 274px;
`;

export const LeftNavMenu = styled.div`
    padding: 8px 0;
    background-color: #4b7aa3;
    width: 100%;
`;

export const LeftNavButton = styled(NavButton)`
    margin: 8px 6px 8px 0;
    border-radius: 0 4px 4px 0;
    text-align: left;
    padding: 0 6px;
    font-size: 24px;
    height: 38px;
    line-height: 38px;
    
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
`;

export const LeftAdd = styled.div`
    box-sizing: border-box;
    max-width: 600px;
`;

export const LeftAdd1 = styled(LeftAdd)`
    border: solid 8px rgb(255, 111, 0);
    cursor: pointer;
`;

export const LeftAdd2 = styled(LeftAdd)`
    border: solid 8px rgb(228, 0, 194);
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
        font-size: 1.6em;
        color: #eae41f;
        width: 100%;
        text-align: center;
        text-shadow:
            rgb(228, 0, 196) -4px -4px 0,
            rgb(228, 0, 196) -4px -2px 0,
            rgb(228, 0, 196) -4px 0 0,
            rgb(228, 0, 196) -4px 2px 0,
            rgb(228, 0, 196) -4px 4px 0,
            rgb(228, 0, 196) -2px -4px 0,
            rgb(228, 0, 196) -2px -2px 0,
            rgb(228, 0, 196) -2px 0 0,
            rgb(228, 0, 196) -2px 2px 0,
            rgb(228, 0, 196) -2px 4px 0,
            rgb(228, 0, 196) 0 -4px 0,
            rgb(228, 0, 196) 0 -2px 0,
            rgb(228, 0, 196) 0 0 0,
            rgb(228, 0, 196) 0 2px 0,
            rgb(228, 0, 196) 0 4px 0,
            rgb(228, 0, 196) 2px -4px 0,
            rgb(228, 0, 196) 2px -2px 0,
            rgb(228, 0, 196) 2px 0 0,
            rgb(228, 0, 196) 2px 2px 0,
            rgb(228, 0, 196) 2px 4px 0,
            rgb(228, 0, 196) 4px -4px 0,
            rgb(228, 0, 196) 4px -2px 0,
            rgb(228, 0, 196) 4px 0 0,
            rgb(228, 0, 196) 4px 2px 0,
            rgb(228, 0, 196) 4px 4px 0;
    }
`;

export const LeftContent = styled.div`
      width: 100%;
      height: 100%;
      position: absolute;
      img {
        width: 100%;
      }
`;
