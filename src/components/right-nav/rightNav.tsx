import React, { FC } from 'react';
import { useSiteContext } from 'src/providers/sites';
import styled from 'styled-components';
import { breakPoints, SPOTIFY_ENABLED } from 'src/constants';

interface Props {}

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
`;

const Gap = styled.div`
  height: 0;
`;

export const RightNav: FC<Props> = () => {
    const { siteMap, selectedSite, fullScreen } = useSiteContext();
    const site = siteMap[selectedSite];

    return (
        <>
            <Gap />
            { selectedSite !== 'gallery' && !fullScreen && (
                <SpotifyContainer>
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
