import React, { FC, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Construction from '@/components/construction';
import { ClientLeftNav } from '@/components/left-nav';
import { ClientList } from '@/components/list';
import RightNav from '@/components/right-nav';
import Unity from '@/components/unity';
import { usePathContext } from '@/providers/path';
import { useSiteContext } from '@/providers/sites';
import { Row, MiddleSection } from '@/styles/sharedstyles';
import { SiteKey } from '@/types';

interface Props {}

const keyMap: Record<string, SiteKey> = {
    a: 'art',
    b: 'biz',
    f: 'fit',
    r: 'rocks',
    g: 'games',
    c: 'construction',
    y: 'gallery',
};

const homeComponent = (site: SiteKey, visible: boolean) => {
    if (site === 'construction')
        return <Construction />;
    if (site === 'gallery')
        return <Unity visible={visible} />;
    return <ClientList visible={visible} />;
};

const Layout: FC<Props> = () => {
    const { keyPressed, selectedSite, setSelectedSite, setFullScreen, fullScreen } = useSiteContext();
    const { prevPath, setPrevPath } = usePathContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (keyPressed === 'Escape' && fullScreen)
            setFullScreen(false);
        if (keyPressed && keyMap[keyPressed] !== undefined && selectedSite !== 'gallery') {
            setSelectedSite(keyMap[keyPressed]);
            navigate('/');
            setFullScreen(false);
            window.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
            document.getElementById('content-row')?.scrollTo(0, 0);
        }
        return () => {};
    }, [fullScreen, keyPressed, navigate, selectedSite, setFullScreen, setSelectedSite]);

    useEffect(() => {
        if (selectedSite === 'biz' && prevPath !== '/' && location.pathname === '/') {
            const videoId = prevPath.split('/video/')[1];
            const elm = document.getElementById(videoId);
            if (elm)
                setTimeout(() => {
                    elm.scrollIntoView({
                        block: 'center',
                        inline: 'nearest',
                    });
                }, 100);
        }

        if (location.pathname !== '/') {
            window.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
            document.getElementById('content-row')?.scrollTo(0, 0);
            if (document.body.clientWidth < 768)
                setFullScreen(true);
        }

        setPrevPath(location.pathname);
    }, [location, prevPath, selectedSite, setFullScreen, setPrevPath]);
    //
    // if (location.pathname.includes('art') && selectedSite !== 'art')
    //     return <Navigate to="/" replace={false} />;
    //
    // if (location.pathname.includes('video') && !['biz', 'rocks', 'fit'].includes(selectedSite))
    //     return <Navigate to="/" replace={false} />;

    return (
        <Row id="content-row">
            { selectedSite !== 'gallery' && <ClientLeftNav /> }
            <MiddleSection id="middle" className={fullScreen ? `${selectedSite} fullScreen` : selectedSite}>
                { homeComponent(selectedSite, location.pathname === '/') }
                <Outlet />
            </MiddleSection>
            { selectedSite !== 'gallery' && <RightNav /> }
        </Row>
    );
};

export default Layout;
