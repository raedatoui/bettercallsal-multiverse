import React, { useEffect, useState } from 'react';
import ClientLayout from '@/components/main/client-layout';
import ServerLayout from '@/components/main/server-layout';
import { config } from '@/constants';
import { useSiteContext } from '@/providers/sites';
import { SiteKey, SiteKeyValidator } from '@/types';
import { picker } from '@/utils';

const MainContainerInner = () => {
    const { selectedSite, fullScreen } = useSiteContext();
    const cur = selectedSite === 'wtf' ? picker<SiteKey>(SiteKeyValidator.options.filter((s) => s !== 'wtf')) : selectedSite;
    const cursor = `${config.cdnUrl}/images/${cur}/cursor.webp`;

    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => {
        setIsSSR(false);
    }, []);

    return (
        <>
            <style jsx global>
                {`
                    body {
                        cursor: url('${cursor}'), auto;
                    }
                `}
            </style>
            {isSSR ? <ServerLayout selectedSite={selectedSite} fullScreen={fullScreen} /> : <ClientLayout />}
        </>
    );
};

// const MainContainer = React.memo(MainContainerInner);

export default MainContainerInner;
