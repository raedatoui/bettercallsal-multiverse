import styled, { Keyframes } from 'styled-components';
import { breakPoints } from 'src/constants';

const BaseSlidingItem = styled.a`
  font-size: 0.3635em;
  margin: auto;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  width: 100%;
  color: #DCDB00;
  cursor: pointer;
  height: auto;
  display: inline-block;
  line-height: 37px;

  @media only screen and (max-width : ${breakPoints.sm.max}px) {
    line-height: 22px;
    font-size: 0.3em;
    min-height: 20px;
    letter-spacing: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    padding-left: 8px;
  }

  @media only screen and (max-width : ${breakPoints.md.max}px) and (min-width : ${breakPoints.md.min}px) {
    line-height: 30px;
  }
`;

export const Baseline = styled(BaseSlidingItem)`
  opacity: 0;
  visibility: visible;
`;

export const SlidingItem = styled(BaseSlidingItem)<
{ visibility: string, translateX: number, animation: Keyframes | null, animationDuration: number }>`
  position: absolute;
  visibility: ${props => props.visibility};
  transform: translateX(${props => `${props.translateX}px`});
  animation: ${props => (props.animation ? props.animation : '')};
  animation-duration: ${props => `${props.animationDuration}s`};

  &:hover {
    color: #DCDB00;
  }
`;

export const SiteUrl = styled(SlidingItem)`
  color: #DCDB00;
  letter-spacing: 8px;
  @media only screen and (max-width : ${breakPoints.sm.max}px) {
    letter-spacing: 2px;
  }
`;

export const LowerBanner = styled(SlidingItem)`
  letter-spacing: 2px;
  
  span {
    margin-left: 10px;
  }

  @media only screen and (max-width : 880px) {
    span {
      display: none;
    }
  }
`;
