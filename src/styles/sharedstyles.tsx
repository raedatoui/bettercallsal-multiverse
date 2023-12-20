import styled from 'styled-components';
import { breakPoints, CDN } from '@/constants';
import { glowShadow, scalingYoyo } from '@/utils/animations';

export const Main = styled.main`
    display: flex;
    flex-direction: column;
    height: 100%;

    @media (max-width: ${breakPoints.sm.max}px) {
        height: auto;
        &.fullScreen {
            height: 100%;
        }
    }

    @media (max-height: 600px) {
        height: auto;
        &.fullScreen {
            height: 100%;
        }
    }

    &.wtf {
        .animatable {
            opacity: 0;
        }
    }
`;

export const Section = styled.section`
    display: flex;
    flex-flow: column;
`;

export const MainSection = styled(Section)`
    box-sizing: border-box;
    @media only screen and (max-width: 1024px) {
        height: initial;
    }
`;

export const Row = styled.div`
    background-image: -webkit-linear-gradient(#fea100, #eae41f, #eae41f, #eae41f);
    background-image: -o-linear-gradient(#fea100, #eae41f, #eae41f, #eae41f);
    background-image: linear-gradient(#fea100, #eae41f, #eae41f, #eae41f);
    position: relative;
    display: flex;
    overflow-x: hidden;
    overflow-y: hidden;

    height: 100%;

    @media (min-height: 601px) and (min-width: ${breakPoints.sm.max}px) {
        flex: 1;
        overflow-y: auto;
    }

    @media (max-width: ${breakPoints.lg1.max}px) {
        flex-direction: column;
    }
`;

export const Row1 = styled(Row)`
    background-color: #4b7aa3;
    background-image: inherit;
    padding: 10px 0;
`;

export const Row2 = styled(Row)`
    background: linear-gradient(to bottom, #fea100, #eae41f);
`;

export const NavButton = styled.div`
    font-family: Pragmatica, Arial, Helvetica, sans-serif;
    font-size: 20px;
    text-transform: uppercase;
    font-stretch: expanded;
    font-weight: bold;
    color: #232323;
    text-align: center;
    cursor: pointer;
    background: linear-gradient(to bottom, #eae41f, #fea100);
    border-radius: 7px;
    border: 1px solid #fff;
    box-shadow:
        0 1px 3px rgba(000, 000, 000, 0.5),
        inset 0 0 1px rgba(255, 255, 255, 0.7);
    text-shadow:
        0 -1px 0 rgba(000, 000, 000, 0.4),
        0 1px 0 rgba(255, 255, 255, 0.3);

    &:hover {
        cursor: pointer;
        background: linear-gradient(to bottom, #d1cb06, #e58800);
        border: 1px solid #fff;
    }
`;

export const StickyContainer = styled.div`
    position: sticky;
    top: 0;
    z-index: 1100;
`;

export const Overlay = styled.div`
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

export const MiddleSection = styled.div`
    position: relative;
    outline: none;
    width: 66.6666666667%;

    &.gallery {
        width: 100%;
    }

    &.fullScreen {
        width: 100%;
        height: 100%;
    }

    @media only screen and (max-width: ${breakPoints.lg1.max}px) {
        width: 100%;
        &.fullScreen {
            width: 100%;
            height: 100%;
        }
    }
`;

export const Caption = styled.h4`
    color: rgb(253, 0, 0);
    text-transform: uppercase;
    margin: auto;
    text-shadow:
        2px 2px white,
        -2px -2px white,
        2px -2px white,
        -2px 2px white;
    text-align: center;
    font-size: 2em;
    padding-top: 10px;
    width: 100%;

    // @media only screen and (max-width: ${breakPoints.sm.max}px) {
    //   font-size: 2em;
    // }

    @media only screen and (min-width: 1024px) and (max-width: 1600px) {
        font-size: 2.35em;
    }

    @media only screen and (min-width: 1600px) {
        font-size: 2.85em;
    }

    &.bizerk {
        animation: ${scalingYoyo(0.5, 2.5)} 2.1s cubic-bezier(0.055, 0.825, 0.485, 0.85) infinite alternate;
    }

    &.off {
        display: none;
    }
`;

export const Quote = styled.h6`
    color: #353521;
    text-transform: uppercase;
    font-size: 20px;
    text-decoration: none;
    padding-bottom: 10px;
    font-style: italic;
    margin-bottom: 0;
`;

export const ContentList = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    &.off {
        display: none;
    }

    a {
        text-decoration: none;
    }

    @media only screen and (max-width: 420px) {
        grid-template-columns: repeat(1, 1fr);
    }

    @media only screen and (min-width: 421px) and (max-width: 620px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media only screen and (min-width: 621px) and (max-width: ${breakPoints.lg1.max}px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media only screen and (min-width: ${breakPoints.lg2.min}px) and (max-width: 849px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media only screen and (min-width: 850px) and (max-width: 1023px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media only screen and (min-width: 1024px) and (max-width: ${breakPoints.lg2.max}px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

export const ContentItem = styled.div`
    margin: 10px;
    display: flex;
    flex-direction: column;
    max-width: 480px;
    position: relative;
    transition: all 0.1s ease-in;

    img {
        object-fit: contain;
        cursor: pointer;
        width: 100% !important;
        position: relative !important;
        height: unset !important;
    }

    @media only screen and (min-width: ${breakPoints.sm.max}px) {
        &:hover {
            box-shadow:
                0 8px 17px 0 rgba(0, 0, 0, 0.3),
                0 6px 20px 0 rgba(234, 228, 31, 0.19);
        }
    }
`;

export const ContentItemTitle = styled.div`
    text-align: center;
    text-transform: uppercase;
    font-size: 16px;
    color: rgb(253, 0, 0);
    padding: 5px 0;
`;

export const PlayerContainer = styled.div`
    width: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    display: none;
    &.loaded {
        display: block;
        //flex-direction: column;
    }

    img {
        object-fit: contain;
        margin: 0 auto;
    }
`;

export const ImageContainer = styled.div`
    width: 100%;
    height: 100%;

    &:hover {
        div {
            display: flex;
        }
    }

    .keen-slider__slide {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .keen-slider__slide img {
        position: absolute;
        transition: opacity 1s ease-in;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
`;

export const ImageOverlay = styled.div<{ width: number; height: number }>`
    width: ${(props) => `${props.width}px`};
    height: ${(props) => `${props.height}px`};
    position: absolute;
    top: 0;
    left: 0;

    //background-color: rgba(0,0,0,0.75);
    display: none;

    img {
        object-fit: contain;
        max-width: 32px;
        max-height: 32px;
        position: absolute;
        left: calc(50% - 32px);
        top: calc(50% - 32px);
    }
`;

export const Player = styled.div<{ width: number; height: number }>`
    width: ${(props) => `${props.width}px`};
    height: ${(props) => `${props.height}px`};
    margin: 0 auto;
    display: block;

    iframe {
        width: ${(props) => `${props.width}px`} !important;
        height: ${(props) => `${props.height}px`} !important;
    }

    &.hide {
        display: none;
    }
`;

export const VideoElement = styled.video<{
    width: number;
    height: number;
    left: number;
}>`
    width: ${(props) => `${props.width}px`};
    height: ${(props) => `${props.height}px`};
    left: ${(props) => `${props.left}px`};
    position: absolute;
`;

export const Bar = styled.div`
    margin: 20px 0;
    display: flex;
    width: 100%;
    align-content: center;
    flex-direction: row;
    justify-content: space-around;
`;

export const VideoText = styled.h5`
    padding: 10px 70px;
    margin-bottom: 0;
    color: white;
    text-transform: uppercase;
    text-shadow:
        2px 2px #f63361,
        -2px -2px #f63361,
        2px -2px #f63361,
        -2px 2px #f63361;
    font-size: 2em;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    text-align: center;
    overflow-wrap: break-word;

    @media only screen and (max-width: ${breakPoints.sm.max}px) {
        padding: 34px 0 0 0;

        &.lower {
            padding: 0;
        }
    }
`;

export const ButtonBar = styled.div`
    top: 5px;
    right: 5px;
    position: absolute;
    display: flex;
`;

export const StopButton = styled(NavButton)`
    height: 30px;
    line-height: 32px;
    padding: 0 10px;
    text-transform: lowercase;
    img {
        margin-top: 2px;
    }
`;

export const GameButtonBar = styled(ButtonBar)<{ left: number; top: number }>`
    top: ${(props) => `${props.top - 32}px`};
    left: ${(props) => `${props.left}px`};
    position: absolute;
`;

export const GameCanvas = styled.canvas<{
    width: number;
    height: number;
    left: number;
}>`
    width: ${(props) => `${props.width}px`};
    height: ${(props) => `${props.height}px`};
    margin-left: ${(props) => `${props.left}px`};
    background: #231f20;
    &.off {
        display: none;
    }
`;

export const GameImageContainer = styled.div<{ width: number; height: number }>`
    width: ${(props) => `${props.width}px`};
    height: ${(props) => `${props.height}px`};
    position: relative;
    margin: 0 auto;
    cursor: pointer;
    img {
        position: absolute;
        top: 0;
        left: 0;

        &.glowy {
            animation: ${glowShadow} 1.5s linear infinite alternate;
        }
    }
`;

export const EcardContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;

    img {
        margin: 12px;
        width: calc(50% - 24px);
    }
    @media only screen and (max-width: ${breakPoints.sm.max}px) {
        img {
            width: 100%;
        }
    }
`;

export const LoadingBar = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const LoadingBarProgressEmpty = styled.div`
    width: 141px;
    height: 18px;
    margin-top: 10px;
    background: url(${() => `${CDN}/unity/progress-bar-empty-dark.png`}) no-repeat center;
`;

export const LoadingBarProgressFull = styled.div<{ width: number }>`
    width: ${(props) => `${props.width}%`};
    height: 18px;
    margin-top: 10px;
    background: url(${() => `${CDN}/unity/progress-bar-full-dark.png`}) no-repeat center;
`;
