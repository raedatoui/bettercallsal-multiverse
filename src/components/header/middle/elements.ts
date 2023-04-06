/* eslint-disable max-len */
import styled from 'styled-components';
import { CDN, headerBreakPoints as breakPoints } from 'src/constants';
import { glowShadow, ltr2, neon1, scalemic, scalingYoyo } from 'src/utils/animations';

export const BetterCall = styled.h1.attrs(props => ({ className: props.className }))`
  font-family: BrushScriptStd, serif;
  user-select: none;
  font-size: 1em;
  text-decoration: none;
  color: #353521;
  text-align: center;
  cursor: pointer;
  text-shadow: rgb(255, 255, 255) -2px -2px 0px, rgb(255, 255, 255) -2px -1px 0px, rgb(255, 255, 255) -2px 0px 0px, rgb(255, 255, 255) -2px 1px 0px, rgb(255, 255, 255) -2px 2px 0px, rgb(255, 255, 255) -1px -2px 0px, rgb(255, 255, 255) -1px -1px 0px, rgb(255, 255, 255) -1px 0px 0px, rgb(255, 255, 255) -1px 1px 0px, rgb(255, 255, 255) -1px 2px 0px, rgb(255, 255, 255) 0px -2px 0px, rgb(255, 255, 255) 0px -1px 0px, rgb(255, 255, 255) 0px 0px 0px, rgb(255, 255, 255) 0px 1px 0px, rgb(255, 255, 255) 0px 2px 0px, rgb(255, 255, 255) 1px -2px 0px, rgb(255, 255, 255) 1px -1px 0px, rgb(255, 255, 255) 1px 0px 0px, rgb(255, 255, 255) 1px 1px 0px, rgb(255, 255, 255) 1px 2px 0px, rgb(255, 255, 255) 2px -2px 0px, rgb(255, 255, 255) 2px -1px 0px, rgb(255, 255, 255) 2px 0px 0px, rgb(255, 255, 255) 2px 1px 0px, rgb(255, 255, 255) 2px 2px 0px;
  
  &.bizerk {
    animation: ${neon1} 3s linear infinite alternate;
  }

  &.better-call-anim {
    animation: ${neon1} 3s linear;
  }

  &.better-call-anim-forever {
    animation: ${neon1} 3s linear infinite alternate;
  }

  &.bizerk {
    animation: ${neon1} 1s linear infinite alternate;
  }

  @media only screen and (max-width : ${breakPoints.sm.max}px) {
    margin: 10px 0;
    //text-align: left;
    //white-space: nowrap;
  }

  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width : ${breakPoints.md.min}px) {
    margin: 10px 0;
  }

  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
    font-size: 1.1em;
    margin-top: 12px;
  }
  @media only screen and (max-width : ${breakPoints.lg2.max}px) and (min-width : ${breakPoints.lg2.min}px) {
    font-size: 1.2em;
  }

  margin: 19px auto 0 auto;
`;

export const BizerkContainer = styled.div`
  margin-top: -15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;

  &.bizerk {
    animation: ${scalingYoyo(1, 2)} 1s cubic-bezier(0.055, 0.825, 0.485, 0.850) infinite alternate;
  }

  height: 52px;
  
  @media only screen and (max-width : ${breakPoints.sm.max}px) {
    height: 32px;
    //justify-content: left;
    //margin-left: 8px;
  }

  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width : ${breakPoints.md.min}px) {
    height: 32px;
  }

  @media only screen and (max-width: ${breakPoints.lg1.max}px) and (min-width: ${breakPoints.lg1.min}px) {
    height: 38px;
  }

  @media only screen and (max-width: ${breakPoints.lg2.max}px) and (min-width: ${breakPoints.lg2.min}px) {
    height: 44px;
  }
`;

export const BizerkImageContainer = styled.div`
  &.art, &.gallery {
    margin-top: -18px;
  }
  
  &.biz {
    margin-top: -10px;
  }

  &.construction {
    margin-top: -16px;
  }
  
  &.fit {
    margin-top: -16px;
  }

  &.games {
    margin-top: -5px;
  }
  
  &.rocks {
    margin-top: -10px;
  }

  @media only screen and (max-width : ${breakPoints.sm.max}px) {
    height: 38px;

    &.art, &.gallery {
      margin-top: -24px;
    }

    &.biz {
      margin-top: -18px;
    }

    &.construction {
      margin-top: -22px;
    }

    &.fit {
      height: 44px;
      margin-top: -12px;
    }

    &.games {
      margin-top: -22px;
    }
    
    &.rocks {
      margin-top: -16px;
    }
  }
  
  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width : ${breakPoints.md.min}px) {
    &.art, &.gallery {
      margin-top: -10px;
    }

    &.biz {
      margin-top: -10px;
    }

    &.construction {
      margin-top: -6px;
    }

    &.fit {
      margin-top: -2px;
    }

    &.games {
      margin-top: -5px;
    }
  }

  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
    &.art, &.gallery {
      margin-top: -10px;
    }
    &.biz {
      margin-top: -4px;
    }
    &.fit {
      margin-top: -2px;
    }

    &.construction {
      margin-top: -10px;
    }
  }
  
  @media only screen and (max-width : ${breakPoints.lg2.max}px) and (min-width : ${breakPoints.lg2.min}px) {
    &.fit {
      margin-top: -2px;
    }
    
    &.construction {
      margin-top: -10px;
    }
  }
`;

export const BizerImage = styled.img<{ background: string }>`
  transition: all 0.5s linear;
  animation: ${glowShadow} 1.5s linear infinite alternate;
  object-fit: contain;
  // background-image:  url(${props => `${CDN}${props.background}`});
  // background-size: 100% 100%;
  // background-position: center;
  // background-repeat: no-repeat;
  
  box-sizing: border-box;
  perspective: 1000px;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  backface-visibility: visible;
  opacity: 1;
  cursor: pointer;
  height: 66px;
  width: auto;

  &:hover {
    animation: ${ltr2} .5s linear 3;
  }

  &.art, &.gallery {
    margin-right: -14px;
  }

  &.biz {
    margin: 0 2px 0 5px;
  }

  &.construction {
    height: 50px;
    margin: 0 6px;
  }

  &.fit {
    width: 69px;
  }
  
  &.games {
    margin-right: -4px;
    margin-left: -4px;
  }
  

  @media only screen and (max-width : ${breakPoints.sm.max}px) {
    height: 38px;

    &.art, &.gallery {
      margin-left: 2px;
      margin-right: -10px;
    }
    
    &.biz {
      
    }

    &.construction {
      height: 30px;
      margin-right: 4px;
      margin-left: 6px;
    }

    &.fit {
      width: 42px;
    }
    
    &.games {
      margin: -2px;
    }


  }
    
  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width : ${breakPoints.md.min}px) {
      height: 38px;
      &.art, &.gallery {
        margin-left: 2px;
        margin-right: -10px;
      }
      &.fit {
        width: 44px;
        margin: 0
      }

      &.construction {
        height: 32px;
      }
  }

  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
    height: 44px;
    &.construction {
      height: 34px;
      margin: 0 4px;
    }

    &.fit {
      height: 48px;
      margin-right: -4px;
      margin-left: -4px;
    }

    &.rocks {
      height: 42px;
      margin: 0 2px 0 5px;
    }
  }

  @media only screen and (max-width : ${breakPoints.lg2.max}px ) and (min-width : ${breakPoints.lg2.min}px) {
    height: 52px;
    &.construction {
      height: 46px;
      margin: 0 6px;
    }

    &.fit {
      height: 60px;
    }

    &.rocks {
      height: 56px;
      margin: 0 2px 0 5px;
    }
  }
`;

// previously attempted in lieu of gif
export const BizerkVideo = styled.video`
  transition: all 0.5s linear;
  animation: ${glowShadow} 1.5s linear infinite alternate;
  box-sizing: border-box;
  perspective: 1000px;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  backface-visibility: visible;
  opacity: 1;
  cursor: pointer;
`;

export const SalName = styled.h2.attrs(props => ({ className: props.className }))`
  color: white;
  text-transform: uppercase;
  font-size: 0.525em;
  text-shadow:
    rgb(246, 51, 97) -2px -2px 0,
    rgb(246, 51, 97) -2px -1px 0,
    rgb(246, 51, 97) -2px 0 0,
    rgb(246, 51, 97) -2px 1px 0,
    rgb(246, 51, 97) -2px 2px 0,
    rgb(246, 51, 97) -1px -2px 0,
    rgb(246, 51, 97) -1px -1px 0,
    rgb(246, 51, 97) -1px 0 0,
    rgb(246, 51, 97) -1px 1px 0,
    rgb(246, 51, 97) -1px 2px 0,
    rgb(246, 51, 97) 0 -2px 0,
    rgb(246, 51, 97) 0 -1px 0,
    rgb(246, 51, 97) 0 0 0,
    rgb(246, 51, 97) 0 1px 0,
    rgb(246, 51, 97) 0 2px 0,
    rgb(246, 51, 97) 1px -2px 0,
    rgb(246, 51, 97) 1px -1px 0,
    rgb(246, 51, 97) 1px 0 0,
    rgb(246, 51, 97) 1px 1px 0,
    rgb(246, 51, 97) 1px 2px 0,
    rgb(246, 51, 97) 2px -2px 0,
    rgb(246, 51, 97) 2px -1px 0,
    rgb(246, 51, 97) 2px 0 0,
    rgb(246, 51, 97) 2px 1px 0,
    rgb(246, 51, 97) 2px 2px 0;
  margin: 0;
  
  &.bizerk {
    animation: ${scalemic} 1s cubic-bezier(0.055, 0.825, 0.485, 0.850) infinite alternate;
  }
`;

export const SalCaption = styled.h3`
  text-align: center;
  color: black;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 0.225em;
  margin: -10px auto 0 auto;

  &.bizerk {
    animation: ${scalingYoyo(1, 2.5)} 1.05s cubic-bezier(0.055, 0.825, 0.485, 0.850) infinite alternate;
  }
  @media only screen and (max-width : ${breakPoints.sm.max}px) {
    //text-align: left;
    margin: -6px 0 0 16px  ;
  }

  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width:  ${breakPoints.md.min}px) {
    white-space: nowrap;
    margin-top: -4px;
  }
  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
    margin: -6.2px auto 0 auto;
  }
  @media only screen and (max-width : ${breakPoints.lg2.max}px) and (min-width : ${breakPoints.lg2.min}px) {
    margin: -7px auto 0 auto;
  }
`;
