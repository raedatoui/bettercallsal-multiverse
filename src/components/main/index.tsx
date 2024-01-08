import React, { FC, useEffect, useState } from 'react';
import ClientAppLayout from '@/components/main/layouts/client-app';
import LinktreeLayout from '@/components/main/layouts/linktree';
import PrivacyLayout from '@/components/main/layouts/privacy';
import ServerAppLayout from '@/components/main/layouts/server-app';
import { config } from '@/constants';
import { useSiteContext } from '@/providers/sites';
import { SiteKey, SiteKeyValidator } from '@/types';
import { picker } from '@/utils';

interface Props {
    page: string;
}

const MainContainer: FC<Props> = ({ page }) => {
    const { selectedSite, fullScreen } = useSiteContext();
    const cur = selectedSite === 'wtf' ? picker<SiteKey>(SiteKeyValidator.options.filter((s) => s !== 'wtf')) : selectedSite;
    const cursor = `${config.cdnUrl}/images/${cur}/cursor.webp`;

    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => {
        setIsSSR(false);
    }, []);

    const getElement = () => {
        if (page === 'privacy') return <PrivacyLayout />;
        if (page === 'linktree') return <LinktreeLayout />;
        if (isSSR) return <ServerAppLayout selectedSite={selectedSite} fullScreen={fullScreen}/>;
        return <ClientAppLayout />;
    };

    return (
        <>
            <style jsx global>
                {`
                    body {
                        cursor: url('${cursor}'), auto;
                    }
                `}
            </style>
            {getElement()}
        </>
    );
};

// const MainContainer = React.memo(MainContainerInner);

export default MainContainer;
