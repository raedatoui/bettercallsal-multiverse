import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { breakPoints, SPOTIFY_ENABLED } from '@/constants';
import { useSiteContext } from '@/providers/sites';

interface Props {}

const blockScroll = keyframes`
  0% {filter:  blur(0px) contrast(1)  saturate(0)}
  //24.99% {filter:  blur(3px) contrast(1.5) saturate(10)}
  //25% {filter:  blur(5px) contrast(2)  saturate(15)}
  //49.99% {filter:  blur(7px) contrast(2.5)  saturate(20)}
  //50% {filter:  blur(9px) contrast(3)  saturate(25)}
  100% {filter:  blur(11px) contrast(3.5) saturate(20)}
`;

const SpotifyContainer = styled.div`
  min-height: 450px;
  width: 16.6666666667%;
  @media only screen and (max-width: ${breakPoints.sm.max}px) {
    min-height: inherit;
    height: 450px;
  }
  @media only screen and (max-width: ${breakPoints.lg1.max}px) {
    width: 100%;
  }
  
  &.bizerk {
    animation: ${blockScroll} 2s linear infinite alternate;
  }
`;

const Gap = styled.div`
  height: 0;
`;

const RightNav: FC<Props> = () => {
    const { siteMap, selectedSite, bizerkMode, fullScreen } = useSiteContext();
    const site = siteMap[selectedSite];

    return (
        <>
            <Gap />
            { selectedSite !== 'gallery' && !fullScreen && (
                <SpotifyContainer className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                    { SPOTIFY_ENABLED && (
                        <iframe
                            title="spotify"
                            src={site.rightNav.objectId}
                            width="100%"
                            height="100%"
                            loading="lazy"
                            frameBorder="0"
                        />
                    ) }
                </SpotifyContainer>
            ) }
        </>
    );
};

export default RightNav;
