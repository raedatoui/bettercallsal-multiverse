/* eslint-disable max-len */
import styled from 'styled-components';
import { headerBreakPoints as breakPoints } from '@/constants';

export const HeaderContainer = styled.header`
    width: 100%;
    font-size: 80px;
    margin: 0 auto 0 auto;
    color: white;
    -webkit-transform-style: flat;
    transform-style: flat;
    background-image: linear-gradient(#fd9f00, #fbfa00);
    box-shadow: inset 0 0 100px hsla(0, 0%, 0%, 0.3);
    z-index: 1;
    position: relative;

    &.off {
        display: none;
    }
    &.on {
        display: block;
    }

    .content {
        width: 100%;
    }

    @media (max-width: ${breakPoints.sm.max}px) {
        position: sticky;
        top: 0;
    }

    @media (min-height: 440px) {
        position: sticky;
        top: 0;
    }

    @media only screen and (max-width: ${breakPoints.md.max}px) {
        font-size: 40px;
    }
    @media only screen and (max-width: ${breakPoints.lg1.max}px) and (min-width: ${breakPoints.lg1.min}px) {
        font-size: 50px;
    }
    @media only screen and (max-width: ${breakPoints.lg2.max}px) and (min-width: ${breakPoints.lg2.min}px) {
        font-size: 60px;
    }
`;

export const ContentContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export const TickerContainer = styled.div<{ background: string }>`
     {
        display: flex;
        background-color: ${(props) => props.background};
        position: relative;
        width: 100%;
    }
`;

export const SalHolder = styled.div`
    margin-top: -30px;
`;
