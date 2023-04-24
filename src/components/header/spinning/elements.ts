import styled from 'styled-components';
import { CDN, headerBreakPoints as breakPoints } from 'src/constants';
import { fadein, ltr, ltr2, rtl, rtl2 } from 'src/utils/animations';

export const SpinningSalsContainer = styled.div`
  -webkit-perspective: 1000px;
  perspective: 1000px;
  position: absolute;
  width: 100%;
  height: 0;
  z-index: 1;
`;

export const SpinningWrapper = styled.div`
  transition: 0.25s;

  &.left {
    float: left;
  }
  
  &.right {
    float: right;
  }
  height: 240px;
  width: 258px;
  
  @media only screen and (max-width: ${breakPoints.sm.max}px) {
    height: 94px;
    width: 102px;
    padding-top: 20px;
    
    &.left {
      margin-left: -16px;
    }
    
    &.right {
      margin-right: -16px;
    }
    
    &.img0.fadein, &.img0.hover {
      display: block;
    }
  }
  
  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width : ${breakPoints.md.min}px) {
    height: 140px !important;
    width: 150.5px !important;
    margin-top: 12px;
  }

  @media only screen and (max-width : ${breakPoints.lg1a.max}px) and (min-width : ${breakPoints.lg1a.min}px) {
    height: 163.5px;
    width: 176px;
    margin-top: 19px;
  }
  
  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min + 101}px) {
    height: 183px;
    width: 198px;
  }

  @media only screen and (max-width : ${breakPoints.lg2.max}px) and (min-width : ${breakPoints.lg2.min}px) {
    height: 219px;
    width: 237px;
  }
`;

export const SpinningImg = styled.div<{ image: string }>`
  width: 100%;
  height: 100%;
  transition: 0.25s;
  box-sizing: border-box;
  perspective: 1000px;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  backface-visibility: visible;
  opacity: 1;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${props => `${CDN}${props.image}`});
  //cursor: pointer;

  &.start {
    opacity: 0;
  }
  
  &.img0.bizerk {
    animation: ${rtl} 1s cubic-bezier(0.055, 0.825, 0.485, 0.850) infinite alternate;
  }

  &.img1.bizerk {
    animation: ${ltr} 1s cubic-bezier(0.055, 0.825, 0.485, 0.850) infinite alternate;
  }

  &.fadein {
    animation: ${fadein} 0.5s linear;
  }

  &.img1.hover {
    animation: ${ltr} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
  }

  &.img1:hover {
    animation: ${ltr2} .5s linear 3;
  }

  &.img0.hover {
    animation: ${rtl} 3s cubic-bezier(0.055, 0.825, 0.485, 0.850);
  }

  &.img0:hover {
    animation: ${rtl2} .5s linear 3;
  }
}`;
