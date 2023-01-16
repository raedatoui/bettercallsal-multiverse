import styled, { Keyframes } from 'styled-components';
import { slideOutFromLeft, slideInFromLeft } from '../animations';

const BaseSlidingItem = styled.a`
  font-size: 0.3635em;
  margin: auto;
  text-transform: uppercase;
  text-align: center;
  width: 100%;
  color: #DCDB00;
  cursor: pointer;
  height: auto;
  display: inline-block;
  line-height: 37px;
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

  // TODO: this might need to move to the BaseSlidingItem
  @media only screen and (max-width : 567px) {
    padding-right: 60px;
    font-size: 0.4em;
    min-height: 20px;
    letter-spacing: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const LowerBanner = styled(SlidingItem)`
  letter-spacing: 4px;
  text-decoration: none;
  
  span {
    margin-left: 10px;
  }
`;
