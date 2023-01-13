import React, { FC, useContext } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import styled from 'styled-components';

interface Props {}

const SpotifyContainer = styled.div`
  min-height: 450px
`;

export const RightNav: FC<Props> = () => {
    const { siteMap, selectedSite } = useContext(SiteContext);
    const site = siteMap[selectedSite];

    return (
        <SpotifyContainer className="two columns">
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
