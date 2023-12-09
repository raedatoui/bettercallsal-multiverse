import React, { FC } from 'react';
import Construction from '@/components/construction';
import GalleryLanding from '@/components/gallery';
import { ServerLeftNav } from '@/components/left-nav';
import { ServerList } from '@/components/list';
import RightNav from '@/components/right-nav';
import { MiddleSection, Row } from '@/styles/sharedstyles';
import { SiteKey } from '@/types';

const homeComponent = (site: SiteKey) => {
    if (site === 'construction') return <Construction />;
    if (site === 'world') return <div>game video</div>;
    if (site === 'gallery') return <GalleryLanding />;
    return <ServerList />;
};

const ServerLayout: FC<{ selectedSite: SiteKey; fullScreen: boolean }> = ({ selectedSite, fullScreen }) => (
    <Row id="content-row" suppressHydrationWarning>
        {selectedSite !== 'gallery' && <ServerLeftNav />}
        <MiddleSection id="middle" className={fullScreen ? `${selectedSite} fullScreen` : selectedSite}>
            {homeComponent(selectedSite)}
        </MiddleSection>
        {selectedSite !== 'gallery' && <RightNav />}
    </Row>
);

export default ServerLayout;
