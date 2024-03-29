/* eslint-disable max-len */
import styled from 'styled-components';
import { headerBreakPoints as breakPoints } from '@/constants';
import { borderAnim, neon2, footerLtr, squigglyText } from '@/utils/animations';

export const LawBreakersContainer = styled.div`
    background-image: linear-gradient(#fda810, #eae41f);
    padding: 4px 0;
    border-top: solid 2px #fda810;
    border-bottom: solid 2px gray;
    display: flex;
    flex-flow: column;
    width: 100%;
    font-size: 45px;

    //&.off {
    //  opacity: 0;
    //}
    @media only screen and (max-width: ${breakPoints.sm.max}px) {
        font-size: 24px;
    }
    @media only screen and (max-width: ${breakPoints.md.max}px) and (min-width: ${breakPoints.md.min}px) {
        font-size: 28px;
    }
    @media only screen and (max-width: ${breakPoints.lg1.max}px) and (min-width: ${breakPoints.lg1.min}px) {
        font-size: 35px;
    }
    @media only screen and (max-width: ${breakPoints.lg2.max}px) and (min-width: ${breakPoints.lg2.min}px) {
        font-size: 45px;
    }
`;

export const LawBreakersP = styled.div`
    text-transform: uppercase;
    display: flex;
    align-items: center;
    text-align: center;
    font-family: Impact, Arial, Helvetica, sans-serif;
    letter-spacing: 4px;
    font-size: 1em;
    height: 60px;
    margin: 0 auto;
    color: #d61d00;
    text-shadow:
        #fff -4px -4px 0,
        #fff -4px -2px 0,
        #fff -4px 0 0,
        #fff -4px 2px 0,
        #fff -4px 4px 0,
        #fff -2px -4px 0,
        #fff -2px -2px 0,
        #fff -2px 0 0,
        #fff -2px 2px 0,
        #fff -2px 4px 0,
        #fff 0 -4px 0,
        #fff 0 -2px 0,
        #fff 0 0 0,
        #fff 0 2px 0,
        #fff 0 4px 0,
        #fff 2px -4px 0,
        #fff 2px -2px 0,
        #fff 2px 0 0,
        #fff 2px 2px 0,
        #fff 2px 4px 0,
        #fff 4px -4px 0,
        #fff 4px -2px 0,
        #fff 4px 0 0,
        #fff 4px 2px 0,
        #fff 4px 4px 0;

    animation: ${borderAnim} 1.5s linear infinite alternate;

    &.bizerk {
        animation: ${neon2} 1s infinite alternate;
    }

    img {
        vertical-align: middle;
        object-fit: contain;
    }

    img,
    video {
        height: 100%;
        margin: 0 20px;
        box-sizing: border-box;
        perspective: 1000px;
        transform-style: preserve-3d;
        transform-origin: 50% 50%;
        backface-visibility: visible;

        &.img0 {
            &.rocks {
                transform: scale(1.5);
            }
            &.art {
                transform: scale(1.2);
            }

            &.bizerk {
                animation: ${footerLtr(-3600, 1, 1)} 1s cubic-bezier(0.055, 0.825, 0.485, 0.85) alternate infinite;
                &.rocks {
                    animation: ${footerLtr(3600, 1.5, 1.5)} 1s cubic-bezier(0.055, 0.825, 0.485, 0.85) alternate infinite;
                }
                &.art {
                    animation: ${footerLtr(3600, 1.2, 1.2)} 1s cubic-bezier(0.055, 0.825, 0.485, 0.85) alternate infinite;
                }
            }
        }

        &.img1 {
            transform: scaleX(-1);
            &.rocks {
                transform: scaleX(-1.5) scaleY(1.5);
            }
            &.art {
                transform: scaleX(-1.2) scaleY(1.2);
            }

            &.bizerk {
                animation: ${footerLtr(3600, 1, 1)} 1s cubic-bezier(0.055, 0.825, 0.485, 0.85) alternate infinite;

                &.rocks {
                    animation: ${footerLtr(3600, -1.5, 1.5)} 1s cubic-bezier(0.055, 0.825, 0.485, 0.85) alternate infinite;
                }
                &.art {
                    animation: ${footerLtr(3600, -1.2, 1.2)} 1s cubic-bezier(0.055, 0.825, 0.485, 0.85) alternate infinite;
                }
            }
        }
    }

    @media only screen and (max-width: ${breakPoints.sm.max}px) {
        height: 35px;
        width: 100%;
        justify-content: space-around;
        img {
            &.img0 {
                margin: 0 10px 0 0;
            }
            &.img1 {
                margin: 0 0 0 10px;
            }
        }
    }
    @media only screen and (max-width: ${breakPoints.md.max}px) and (min-width: ${breakPoints.md.min}px) {
        height: 40px;
    }
    @media only screen and (max-width: ${breakPoints.lg1.max}px) and (min-width: ${breakPoints.lg1.min}px) {
        height: 50px;
    }
    @media only screen and (max-width: ${breakPoints.lg2.max}px) and (min-width: ${breakPoints.lg2.min}px) {
        height: 60px;
    }
`;

export const LawBreakersSpan = styled.span`
    vertical-align: middle;
    cursor: pointer;
`;

export const FooterContainer = styled.footer`
    height: 35px;
    line-height: 35px;
    background-color: #f13400;
    font-size: 80px;
    width: 100%;

    @media only screen and (max-width: ${breakPoints.md.max}px) {
        font-size: 40px;
    }
    @media only screen and (max-width: ${breakPoints.lg1.max}px) and (min-width: ${breakPoints.lg1.min}px) {
        font-size: 50px;
    }
    @media only screen and (max-width: ${breakPoints.lg2.max}px) and (min-width: ${breakPoints.lg2.min}px) {
        font-size: 60px;
    }

    h2 {
        height: 35px;
        line-height: 35px;
        background-color: #f13400;
        text-transform: uppercase;
        color: #dcdb00;
        font-size: 0.3635em;
        margin: 0 auto;
        letter-spacing: 8px;

        @media only screen and (max-width: ${breakPoints.sm.max}px) {
            letter-spacing: 2px;
        }
        @media only screen and (max-width: ${breakPoints.md.max}px) and (min-width: ${breakPoints.md.min}px) {
            letter-spacing: 4px;
        }
        @media only screen and (max-width: ${breakPoints.lg1.max}px) and (min-width: ${breakPoints.lg1.min}px) {
            letter-spacing: 6px;
        }

        a {
            text-decoration: none;
            color: inherit;

            &:hover {
                color: inherit;
            }
        }
    }
    &.bizerk {
        h2 {
            animation: ${squigglyText} 3s linear alternate infinite;
        }
    }
`;
