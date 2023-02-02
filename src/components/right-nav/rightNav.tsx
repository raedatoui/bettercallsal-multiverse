import React, { FC } from 'react';
import { useSiteContext } from 'src/providers/sites';
import styled from 'styled-components';

interface Props {}

const SpotifyContainer = styled.div`
  min-height: 450px;
  width: 16.6666666667%;
  @media only screen and (max-width: 1023px) {
    width: 100%;
  }
`;

export const RightNav: FC<Props> = () => {
    const { siteMap, selectedSite } = useSiteContext();
    const site = siteMap[selectedSite];

    return (
        <SpotifyContainer>
            <iframe
                title="spotify"
                src={site.rightNav.objectId}
                width="100%"
                height="100%"
                loading="lazy"
                frameBorder="0"
            />
        </SpotifyContainer>
    );
};
