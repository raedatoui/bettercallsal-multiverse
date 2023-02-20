/* eslint-disable max-len */
import styled from 'styled-components';
import { borderAnim, neon2, fadein, footerLtr } from 'src/utils/animations';
import { breakPoints } from 'src/constants';

export const LawBreakersContainer = styled.div`
  background-image: linear-gradient(#fda810, #eae41f);
  padding: 4px 0;
  border-top: solid 2px #fda810;
  border-bottom: solid 2px gray;
  display: flex;
  flex-flow: column;
  width: 100%;
  font-size: 45px;
  
  @media only screen and (max-width: ${breakPoints.sm.max}px) {
    font-size: 24px;
  }
  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width: ${breakPoints.md.min}px) {
    font-size: 28px;
  }
  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
    font-size: 35px;
  }
  @media only screen and (max-width : ${breakPoints.lg2.max}px) and (min-width : ${breakPoints.lg2.min}px) {
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
  text-shadow: #fff -4px -4px 0, #fff -4px -2px 0, #fff -4px 0 0, #fff -4px 2px 0, #fff -4px 4px 0, #fff -2px -4px 0, #fff -2px -2px 0, #fff -2px 0 0, #fff -2px 2px 0, #fff -2px 4px 0, #fff 0 -4px 0, #fff 0 -2px 0, #fff 0 0 0, #fff 0 2px 0, #fff 0 4px 0, #fff 2px -4px 0, #fff 2px -2px 0, #fff 2px 0 0, #fff 2px 2px 0, #fff 2px 4px 0, #fff 4px -4px 0, #fff 4px -2px 0, #fff 4px 0 0, #fff 4px 2px 0, #fff 4px 4px 0;

  &.better-call-anim {
    animation: ${neon2} 3s linear;
  }
  
  &.init {
    animation: ${borderAnim} 1.5s linear infinite alternate;
  }
  
  img {
    vertical-align: middle;
    object-fit: contain;
  }

  img, video {
    height: 100%;
    margin: 0 20px;
    transition: 0.25s;
    box-sizing: border-box;
    perspective: 1000px;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    backface-visibility: visible;
    opacity: 1;

    &.start {
      opacity: 0;
    }

    &.fadein {
      animation: ${fadein} 0.5s linear;
    }

    &.img0 {
      &.rocks {
        transform: scale(1.5);
      }
      &.art {
        transform: scale(1.2);
      }
      &.hover {
        animation: ${footerLtr(-3600, 1, 1)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
        &.rocks { 
          animation: ${footerLtr(3600, 1.5, 1.5)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
        }
        &.art {
          animation: ${footerLtr(3600, 1.2, 1.2)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
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
      &.hover {
        animation: ${footerLtr(3600, 1, 1)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);

        &.rocks {
          animation: ${footerLtr(3600, -1.5, 1.5)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
        }
        &.art {
          animation: ${footerLtr(3600, -1.2, 1.2)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
        }
      }
    }
  }

  @media only screen and (max-width: ${breakPoints.sm.max}px) {
    height: 35px;
    width: 100%;
    justify-content: space-around;
  }
  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width : ${breakPoints.md.min}px) {
    height: 40px;
  }
  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
    height: 50px;
  }
  @media only screen and (max-width : ${breakPoints.lg2.max}px) and (min-width : ${breakPoints.lg2.min}px) {
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
  background-color: #F13400;
  font-size: 80px;
  width: 100%;
  //position: fixed;
  //bottom: 0;

  @media only screen and (max-width : ${breakPoints.md.max}px) {
    font-size: 40px;
  }
  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
    font-size: 50px;
  }
  @media only screen and (max-width : ${breakPoints.lg2.max}px) and (min-width : ${breakPoints.lg2.min}px) {
    font-size: 60px;
  }

  h2 {
    height: 35px;
    line-height: 35px;
    background-color: #F13400;
    text-transform: uppercase;
    color: #DCDB00;
    font-size: 0.3635em;
    margin: 0 auto;
    letter-spacing: 8px;

    @media only screen and (max-width : ${breakPoints.sm.max}px) {
      letter-spacing: 2px;
    }
    @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width: ${breakPoints.md.min}px) {
      letter-spacing: 4px;
    }
    @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
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
`;
