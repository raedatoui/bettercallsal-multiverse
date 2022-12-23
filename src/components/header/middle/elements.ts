/* eslint-disable max-len */
import styled from 'styled-components';
import { glowShadow, neon1, scalemic, scalemic2 } from '../animations';

export const BetterCall = styled.h1.attrs(props => ({ className: props.className }))`
  font-family: BrushScriptStd, serif;
  user-select: none;
  font-size: 1em;
  margin: 16px auto 0 auto;
  text-decoration: none;
  color: #353521;
  text-align: center;
  text-shadow: rgb(255, 255, 255) -2px -2px 0px, rgb(255, 255, 255) -2px -1px 0px, rgb(255, 255, 255) -2px 0px 0px, rgb(255, 255, 255) -2px 1px 0px, rgb(255, 255, 255) -2px 2px 0px, rgb(255, 255, 255) -1px -2px 0px, rgb(255, 255, 255) -1px -1px 0px, rgb(255, 255, 255) -1px 0px 0px, rgb(255, 255, 255) -1px 1px 0px, rgb(255, 255, 255) -1px 2px 0px, rgb(255, 255, 255) 0px -2px 0px, rgb(255, 255, 255) 0px -1px 0px, rgb(255, 255, 255) 0px 0px 0px, rgb(255, 255, 255) 0px 1px 0px, rgb(255, 255, 255) 0px 2px 0px, rgb(255, 255, 255) 1px -2px 0px, rgb(255, 255, 255) 1px -1px 0px, rgb(255, 255, 255) 1px 0px 0px, rgb(255, 255, 255) 1px 1px 0px, rgb(255, 255, 255) 1px 2px 0px, rgb(255, 255, 255) 2px -2px 0px, rgb(255, 255, 255) 2px -1px 0px, rgb(255, 255, 255) 2px 0px 0px, rgb(255, 255, 255) 2px 1px 0px, rgb(255, 255, 255) 2px 2px 0px;

  &.better-call-anim {
    -webkit-animation: ${neon1} 3s linear;
    -moz-animation: ${neon1} 3s linear;
    animation: ${neon1} 3s linear;
  }

  &.better-call-anim-forever {
    -webkit-animation: ${neon1} 3s linear infinite alternate;
    -moz-animation: ${neon1} 3s linear infinite alternate;
    animation: ${neon1} 3s linear infinite alternate;
  }

  &.bizerk {
    animation: ${neon1} 1s linear infinite alternate;
  }

  @media only screen and (max-width : 567px) {
    padding-right: 50px;
    white-space: nowrap;
  }

  @media only screen and (max-width : 1020px) and (min-width : 568px) {
    font-size: 1.1em;
  }
  @media only screen and (max-width : 1273px) and (min-width : 1021px) {
    font-size: 1.2em;
  }
`;

export const BizerkIcon = styled.div.attrs(props => ({ className: props.className }))`
  //height: 66px;
  //left: 25px;
  //top: 106px;
  //position: absolute;
  //margin: auto 50%;
  margin-top: -15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;

  &.bizerk {
    animation: ${scalemic2} 1s cubic-bezier(0.055, 0.825, 0.485, 0.850) infinite alternate;
  }
  @media only screen and (max-width : 567px) {
    margin-top: -17px;
  }
  @media only screen and (max-width : 1020px) and (min-width : 568px) {
    margin-top: -22px;
  }
`;

export const BizerkImageContainer = styled.div`
  &.biz {
    margin-top: -25px;
  }

  &.fit {
    margin-top: -22px;
  }

  &.art {
    margin-top: -25px;
  }

  &.rocks {
    margin-top: -10px;
  }

  &.games {
    margin-top: -15px;
  }

  &.construction {
    margin-top: -12px;
  }

`;

export const BizerImage = styled.div<{ background: string }>`
  transition: all 0.5s linear;
  animation: ${glowShadow} 1.5s linear infinite alternate;
  background-image:  url(${props => props.background});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  &.biz {
    height: 66px;
    width: 50.65px;
    margin: 0 2px 0 5px;
  }

  &.fit {
    height: 66px;
    width: 69px;
    margin: 0 0;
  }

  &.art {
    height: 66px;
    width: 67px;
    margin-right: -16px;
    margin-left: 0px;
  }

  &.rocks {
    height: 66px;
    width: 46px;
    margin: 0 2px 0 5px;
  }
  
  &.games {
    height: 60px;
    width: 60px;
    margin: 0 -4px;
  }

  &.construction {
    height: 50px;
    width: 50px;
    margin: 0 2px 0 4px;
  }

  
  @media only screen and (max-width : 567px) {
      height: 32px;
      //top: 45px;
      //left: -12px;
  }
  @media only screen and (max-width : 1020px) and (min-width : 568px) {
    height: 42px;
    //left: 15px;
    //top: 63px;
  }

  @media only screen and (max-width : 1273px) and (min-width : 1021px) {
      height: 48px;
      //left: 20px;
      //top: 77px;
  }
`;

export const SalName = styled.h3.attrs(props => ({ className: props.className }))`
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

export const SalCaption = styled.h4`
  text-align: center;
  color: black;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 0.225em;
  margin: -10px auto 0 auto;
  @media only screen and (max-width : 567px) {
    padding-right: 50px;
    white-space: nowrap;
    margin-top: -4px;
  }
  @media only screen and (max-width : 1020px) and (min-width : 568px) {
    margin: -6.2px auto 0 auto;
  }
  @media only screen and (max-width : 1273px) and (min-width : 1021px) {
    margin: -7px auto 0 auto;
  }
`;
