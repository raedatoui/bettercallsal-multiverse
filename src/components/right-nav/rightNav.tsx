import React, { FC, useContext } from 'react';
import { SiteContext } from 'src/providers/site-provider';

interface Props {}

export const RightNav: FC<Props> = () => {
    const { siteMap, selectedSite } = useContext(SiteContext);
    const site = siteMap[selectedSite];

    return (
        <div className="two columns">
            <iframe
                title="spotify"
                src={site.rightNav.objectId}
                width="100%"
                height="100%"
                loading="lazy"
                frameBorder="0"
            />
        </div>
    );
};
