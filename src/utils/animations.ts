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

export const scalingYoyo = (min = 1, max = 2) => keyframes`
  0% {
    transform: scale(${min});
  }

  100% {
    transform: scale(${max});
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

export const neon2 = keyframes`
  from {
    color: #ffffff;
    text-shadow: #a2b3a0 -4px -4px 0, #a2b3a0 -4px -2px 0, #a2b3a0 -4px 0 0, #a2b3a0 -4px 2px 0, #a2b3a0 -4px 4px 0, #a2b3a0 -2px -4px 0, #a2b3a0 -2px -2px 0, #a2b3a0 -2px 0 0, #a2b3a0 -2px 2px 0, #a2b3a0 -2px 4px 0, #a2b3a0 0 -4px 0, #a2b3a0 0 -2px 0, #a2b3a0 0 0 0, #a2b3a0 0 2px 0, #a2b3a0 0 4px 0, #a2b3a0 2px -4px 0, #a2b3a0 2px -2px 0, #a2b3a0 2px 0 0, #a2b3a0 2px 2px 0, #a2b3a0 2px 4px 0, #a2b3a0 4px -4px 0, #a2b3a0 4px -2px 0, #a2b3a0 4px 0 0, #a2b3a0 4px 2px 0, #a2b3a0 4px 4px 0;
  }

  to {
    color: #d61d00;
    text-shadow: #fff -4px -4px 0, #fff -4px -2px 0, #fff -4px 0 0, #fff -4px 2px 0, #fff -4px 4px 0, #fff -2px -4px 0, #fff -2px -2px 0, #fff -2px 0 0, #fff -2px 2px 0, #fff -2px 4px 0, #fff 0 -4px 0, #fff 0 -2px 0, #fff 0 0 0, #fff 0 2px 0, #fff 0 4px 0, #fff 2px -4px 0, #fff 2px -2px 0, #fff 2px 0 0, #fff 2px 2px 0, #fff 2px 4px 0, #fff 4px -4px 0, #fff 4px -2px 0, #fff 4px 0 0, #fff 4px 2px 0, #fff 4px 4px 0;

  }
`;

export const borderYoyo = keyframes`
  0% {
    border-width: 8px
  }
  100% {
    border-width: 16px
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

export const squigglySlideInFromLeft = (x:string) => keyframes`
    0% { 
      filter: url('#squiggly-0');
      transform: translateX(${x});
    }
    25% {
      filter: url('#squiggly-1');
    }    
    50% {
      filter: url('#squiggly-2');
    }    
    75% {
      filter: url('#squiggly-3');
    }
    100% {
      filter: url('#squiggly-4');
      transform: translateX(0);
    }
`;

export const squigglySlideOutFromLeft = (x:string) => keyframes`
    0% { 
      filter: url('#squiggly-0');
      transform: translateX(0);
    }
    25% {
      filter: url('#squiggly-1');
    }    
    50% {
      filter: url('#squiggly-2');
    }    
    75% {
      filter: url('#squiggly-3');
    }
    100% {
      filter: url('#squiggly-4');
      transform: translateX(${x});
    }
`;

export const squigglyText = keyframes`
  0% {
    filter: url('#squiggly-0');
  }
  25% {
    filter: url('#squiggly-1');
  }
  50% {
    filter: url('#squiggly-2');
  }
  75% {
    filter: url('#squiggly-3');
  }
  100% {
    filter: url('#squiggly-4');
  }
`;

export const borderAnim = keyframes`
    from {
        text-shadow: #a2b3a0 -4px -4px 0, #a2b3a0 -4px -2px 0, #a2b3a0 -4px 0 0, #a2b3a0 -4px 2px 0, #a2b3a0 -4px 4px 0, #a2b3a0 -2px -4px 0, #a2b3a0 -2px -2px 0, #a2b3a0 -2px 0 0, #a2b3a0 -2px 2px 0, #a2b3a0 -2px 4px 0, #a2b3a0 0 -4px 0, #a2b3a0 0 -2px 0, #a2b3a0 0 0 0, #a2b3a0 0 2px 0, #a2b3a0 0 4px 0, #a2b3a0 2px -4px 0, #a2b3a0 2px -2px 0, #a2b3a0 2px 0 0, #a2b3a0 2px 2px 0, #a2b3a0 2px 4px 0, #a2b3a0 4px -4px 0, #a2b3a0 4px -2px 0, #a2b3a0 4px 0 0, #a2b3a0 4px 2px 0, #a2b3a0 4px 4px 0;
    }

    to {
        text-shadow: #fff -4px -4px 0, #fff -4px -2px 0, #fff -4px 0 0, #fff -4px 2px 0, #fff -4px 4px 0, #fff -2px -4px 0, #fff -2px -2px 0, #fff -2px 0 0, #fff -2px 2px 0, #fff -2px 4px 0, #fff 0 -4px 0, #fff 0 -2px 0, #fff 0 0 0, #fff 0 2px 0, #fff 0 4px 0, #fff 2px -4px 0, #fff 2px -2px 0, #fff 2px 0 0, #fff 2px 2px 0, #fff 2px 4px 0, #fff 4px -4px 0, #fff 4px -2px 0, #fff 4px 0 0, #fff 4px 2px 0, #fff 4px 4px 0;
    }
`;

export const glowShadow = keyframes`
  to {
    -webkit-filter: brightness(2) drop-shadow(.5rem .5rem 0.5rem #f20);
    filter: brightness(2) drop-shadow(.5rem .5rem 0.5rem #f20);
  }
`;

export const footerLtr = (rotate: number, scaleX: number, scaleY:number) => keyframes`
    0% { transform: rotateY(0) scaleX(${scaleX}) scaleY(${scaleY}); }
    100% { transform: rotateY(${rotate}deg)  scaleX(${scaleX}) scaleY(${scaleY}); }
`;
