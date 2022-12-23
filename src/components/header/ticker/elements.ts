import styled from 'styled-components';
import { slideOutFromLeft, slideInFromLeft } from '../animations';

const SlidingItem = styled.a<{ sw: number }>`
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

  &.baseline {
    opacity: 0;
  }

  &.item {
    position: absolute;
    opacity: 1;
    transform: translateX(${props => `-${props.sw}px`});
    &.initial {
      transform: translateX(0);
    }
  }

  &.slideOut {
    animation: ${props => slideOutFromLeft(`-${props.sw}px`)} 1.75s linear;
    transform: translateX(${props => `-${props.sw}px`});
  }

  &.slideIn {
    animation: ${props => slideInFromLeft(`${props.sw / 2}px`)} 1.25s linear;
    transform: translateX(0);
  }
  
  &:hover {
    color: #DCDB00;
  }
`;

export const SiteUrl = styled(SlidingItem)`
  color: #DCDB00;
  letter-spacing: 8px;

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
