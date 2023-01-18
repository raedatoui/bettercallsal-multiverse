/* eslint-disable max-len */
import styled from 'styled-components';
import { borderAnim, neon2, fadein, footerLtr } from 'src/utils/animations';

export const LawBreakersContainer = styled.div`
  background-image: linear-gradient(#fda810, #eae41f);
  padding: 4px 0;
  border-top: solid 2px #fda810;
  border-bottom: solid 2px gray;
  display: flex;
  flex-flow: column;
  position: fixed;
  bottom: 35px;
  width: 100%;
`;

export const LawBreakersP = styled.div`
  text-transform: uppercase;
  display: flex;
  align-items: center;
  text-align: center;
  font-family: Impact, Arial, Helvetica, sans-serif;
  letter-spacing: 4px;
  font-size: 45px;
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
    height: 100%;
    margin: 0 40px;
    vertical-align: middle;
    object-fit: contain;
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
      &.hover {
        animation: ${footerLtr(-3600, 1, 1)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
        &.rocks { 
          animation: ${footerLtr(3600, 1.5, 1.5)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
        }
      }
    }

    &.img1 {
      transform: scaleX(-1);
      &.rocks {
        transform: scaleX(-1.5) scaleY(1.5);
      }
      &.hover {
        animation: ${footerLtr(3600, 1, 1)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);

        &.rocks {
          animation: ${footerLtr(3600, -1.5, 1.5)} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
        }
      }
    }
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
  position: fixed;
  bottom: 0;
  width: 100%;

  h2 {
    height: 35px;
    line-height: 35px;
    background-color: #F13400;
    text-transform: uppercase;
    color: #DCDB00;
    font-size: 0.3635em;
    margin: 0 auto;
    letter-spacing: 8px;
    
    a {
      text-decoration: none;
      color: inherit;

      &:hover {
        color: inherit;
      }
    }
  }
`;
