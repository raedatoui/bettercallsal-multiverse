/* eslint-disable max-len */
import { keyframes } from 'styled-components';

export const fadein = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`;

export const fadeout = keyframes`
    0% {   opacity: 1; }
    100% { opacity: 0; }
`;

export const ltr = keyframes`
    0% { transform: rotateY(0); }
    100% { transform: rotateY(3600deg); }
`;

export const rtl = keyframes`
    0% { transform: rotateY(0); }
    100% { transform: rotateY(-3600deg); }
`;

export const ltr2 = keyframes`
    0% { transform: rotateY(0); }
    100% { transform: rotateY(360deg); }
`;

export const rtl2 = keyframes`
    0% { transform: rotateY(0); }
    100% { transform: rotateY(-360deg); }
`;

export const scalemic2 = keyframes`
  0% {
    transform: scale(1) translateX(0) translateY(0);
  }

  100% {
    transform: scale(2) translateX(50%) translateY(-25%);
  }
`;

export const neon1 = keyframes`
  from {
    color: #ffffff;
    text-shadow: rgb(241, 52, 0) -2px -2px 0px, rgb(241, 52, 0) -2px -1px 0px, rgb(241, 52, 0) -2px 0px 0px, rgb(241, 52, 0) -2px 1px 0px, rgb(241, 52, 0) -2px 2px 0px, rgb(241, 52, 0) -1px -2px 0px, rgb(241, 52, 0) -1px -1px 0px, rgb(241, 52, 0) -1px 0px 0px, rgb(241, 52, 0) -1px 1px 0px, rgb(241, 52, 0) -1px 2px 0px, rgb(241, 52, 0) 0px -2px 0px, rgb(241, 52, 0) 0px -1px 0px, rgb(241, 52, 0) 0px 0px 0px, rgb(241, 52, 0) 0px 1px 0px, rgb(241, 52, 0) 0px 2px 0px, rgb(241, 52, 0) 1px -2px 0px, rgb(241, 52, 0) 1px -1px 0px, rgb(241, 52, 0) 1px 0px 0px, rgb(241, 52, 0) 1px 1px 0px, rgb(241, 52, 0) 1px 2px 0px, rgb(241, 52, 0) 2px -2px 0px, rgb(241, 52, 0) 2px -1px 0px, rgb(241, 52, 0) 2px 0px 0px, rgb(241, 52, 0) 2px 1px 0px, rgb(255, 255, 255) 2px 2px 0px;
  }

  to {
    color: #353521;
    text-shadow: rgb(255, 255, 255) -2px -2px 0px, rgb(255, 255, 255) -2px -1px 0px, rgb(255, 255, 255) -2px 0px 0px, rgb(255, 255, 255) -2px 1px 0px, rgb(255, 255, 255) -2px 2px 0px, rgb(255, 255, 255) -1px -2px 0px, rgb(255, 255, 255) -1px -1px 0px, rgb(255, 255, 255) -1px 0px 0px, rgb(255, 255, 255) -1px 1px 0px, rgb(255, 255, 255) -1px 2px 0px, rgb(255, 255, 255) 0px -2px 0px, rgb(255, 255, 255) 0px -1px 0px, rgb(255, 255, 255) 0px 0px 0px, rgb(255, 255, 255) 0px 1px 0px, rgb(255, 255, 255) 0px 2px 0px, rgb(255, 255, 255) 1px -2px 0px, rgb(255, 255, 255) 1px -1px 0px, rgb(255, 255, 255) 1px 0px 0px, rgb(255, 255, 255) 1px 1px 0px, rgb(255, 255, 255) 1px 2px 0px, rgb(255, 255, 255) 2px -2px 0px, rgb(255, 255, 255) 2px -1px 0px, rgb(255, 255, 255) 2px 0px 0px, rgb(255, 255, 255) 2px 1px 0px, rgb(255, 255, 255) 2px 2px 0px;
  }
`;

export const glowShadow = keyframes`
  to {
    -webkit-filter: brightness(2) drop-shadow(.5rem .5rem 0.5rem #f20);
    filter: brightness(2) drop-shadow(.5rem .5rem 0.5rem #f20);
  }
`;

export const scalemic = keyframes`
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(2);
  }
`;

export const slideInFromLeft = (x:string) => keyframes`
  0% {
    transform: translateX(${x});
  }
  100% {
    transform: translateX(0);
  }
`;

export const slideOutFromLeft = (x:string) => keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(${x});
  }
`;
