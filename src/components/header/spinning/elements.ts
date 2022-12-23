import styled from 'styled-components';
import { fadein, ltr, ltr2, rtl, rtl2 } from '../animations';

export const SpinningSalsContainer = styled.div`
  -webkit-perspective: 1000px;
  perspective: 1000px;
  position: absolute;
  width: 100%;
  height: 0;
  top: 1px;
  z-index: 5;

  @media only screen and (max-width : 1273px) and (min-width : 1021px) {
    top: 0;
  }
  @media only screen and (max-width : 1020px) and (min-width : 669px) {
    top: 11px;
  }
  @media only screen and (max-width : 668px) and (min-width : 568px) {
    top: 27px;
  }
`;

export const SpinningWrapper = styled.div`
  z-index: 5;
  transition: 0.25s;
  height: 240px;
  width: 258px;

  &.left {
    float: left;
  }
  
  &.right {
    float: right;
  }
  
  @media only screen and (max-width: 567px) {
    height: 120px;
    width: 129px;
  }

  @media only screen and (max-width : 668px) and (min-width : 568px) {
    height: 114px !important;
    width: 122.55px !important;
  }

  @media only screen and (max-width : 1020px) and (min-width : 669px) {
    height: 152px;
    width: 164.4px;
  }

  @media only screen and (max-width : 1273px) and (min-width : 1021px) {
    height: 188.5px;
    width: 203px;
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
  background-image: url(${props => props.image});

  &.start {
    opacity: 0;
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


  @media only screen and (max-width : 567px) {
    &.img0 {
      opacity: 0;
    }

    &.img0.fadein, &.img0.hover {
      opacity: 1;
    }
  }
}`;
