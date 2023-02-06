import styled from 'styled-components';
import { CDN, breakPoints } from 'src/constants';
import { fadein, ltr, ltr2, rtl, rtl2 } from '../../../utils/animations';

export const SpinningSalsContainer = styled.div`
  -webkit-perspective: 1000px;
  perspective: 1000px;
  position: absolute;
  width: 100%;
  height: 0;
  z-index: 1;

  //@media only screen and (max-width : 1273px) and (min-width : 1021px) {
  //  top: 0;
  //}
  //@media only screen and (max-width : 1020px) and (min-width : 669px) {
  //  top: 11px;
  //}
  //@media only screen and (max-width : 668px) and (min-width : 568px) {
  //  top: 27px;
  //}

  // @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
  //   top: 11px;
  // }
`;

export const SpinningWrapper = styled.div`
  transition: 0.25s;

  &.left {
    float: left;
  }
  
  &.right {
    float: right;
  }
  
  @media only screen and (max-width: ${breakPoints.sm.max}px) {
    height: 120px;
    width: 129px;
  }

  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width : ${breakPoints.md.min}px) {
    height: 114px !important;
    width: 122.55px !important;
  }

  @media only screen and (max-width : ${breakPoints.lg1.max}px) and (min-width : ${breakPoints.lg1.min}px) {
    height: 184px;
    width: 198px;
  }

  @media only screen and (max-width : ${breakPoints.lg2.max}px) and (min-width : ${breakPoints.lg2.min}px) {
    height: 219px;
    width: 237px;
  }
  height: 240px;
  width: 258px;
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
