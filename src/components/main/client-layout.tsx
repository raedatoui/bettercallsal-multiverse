import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Construction from '@/components/construction';
import { ClientLeftNav } from '@/components/left-nav';
import { ClientList } from '@/components/list';
import RightNav from '@/components/right-nav';
import Unity from '@/components/unity';
import { Youtube } from '@/components/video';
import { SoundContext } from '@/providers/audio-context';
import { usePathContext } from '@/providers/path';
import { useSiteContext } from '@/providers/sites';
import { Row, MiddleSection } from '@/styles/sharedstyles';
import { BaseContentItem, SiteKey } from '@/types';
import { audioTween } from '@/utils/gsap';

const keyMap: Record<string, SiteKey> = {
    a: 'art',
    b: 'biz',
    f: 'fit',
    r: 'rocks',
    g: 'games',
    c: 'construction',
    y: 'gallery',
    w: 'world',
    t: 'wtf',
};

const homeComponent = (site: SiteKey, visible: boolean, list: BaseContentItem[]) => {
    if (site === 'construction') return <Construction />;
    if (site === 'world') {
        if (visible) return <Youtube contentItem={list[0]} />;
        return <div></div>;
    }
    if (site === 'gallery') return <Unity />;
    // DOC: the canvas cant be part of the component if we want to manage unityInstance and call Quit on it.
    // instead of the nav and this component listen to location changes and cleanup accordingly,
    // the clean is encapsulated in the unity component, but since cleanup is running when the component is unmounted,
    // the Quit crashed unity. maybe use portals here. whatever. a single canvas placeholder is actually better.
    return <ClientList visible={visible} />;
};

const ClientLayout = () => {
    const { selectedSite, siteMap, setSelectedSite, setFullScreen, fullScreen, contentMap } = useSiteContext();
    const { prevPath, setPrevPath } = usePathContext();
    const { buffers } = useContext(SoundContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [keyPressed, setKeyPressed] = useState<string | null>(null);
    const [hotKeyMode, setHotKeyMode] = useState<boolean>(true);

    const [aTween, setATween] = useState<gsap.core.Tween>();

    useEffect(() => {
        const downHandler = (ev: KeyboardEvent) => {
            setKeyPressed(ev.key);
        };

        const upHandler = () => {
            setTimeout(() => {
                setKeyPressed(null);
            }, 100);
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    });

    useEffect(() => {
        if (keyPressed === 'Escape' && fullScreen) setFullScreen(false);
        if (keyPressed === ' ') setHotKeyMode(!hotKeyMode);
        if (keyPressed && keyMap[keyPressed] !== undefined)
            if (hotKeyMode) {
                setSelectedSite(keyMap[keyPressed]);
                setFullScreen(false);
                window.scrollTo(0, 0);
                document.body.scrollTo(0, 0);
                document.getElementById('content-row')?.scrollTo(0, 0);
                return;
            } else {
                let tween = aTween;
                if (aTween?.isActive()) {
                    buffers.stopAll();
                    aTween.kill();
                }
                tween = audioTween(buffers, siteMap[keyMap[keyPressed]]);
                setATween(tween);
                tween.play();
            }
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
        } else {
            window.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
            document.getElementById('content-row')?.scrollTo(0, 0);
        }

        if (location.pathname !== '/' && document.body.clientWidth < 768 && !location.pathname.startsWith('/category/')) setFullScreen(true);
        else if (document.body.clientWidth < 768) setFullScreen(false);

        setPrevPath(location.pathname);
    }, [location, prevPath, selectedSite, setFullScreen, setPrevPath]);

    return (
        <Row id="content-row">
            {selectedSite !== 'gallery' && <ClientLeftNav />}
            <MiddleSection id="middle" className={fullScreen ? `${selectedSite} fullScreen` : selectedSite}>
                <canvas id="unity-canvas" />
                {homeComponent(selectedSite, location.pathname === '/', contentMap[selectedSite])}
                <Outlet />
            </MiddleSection>
            {selectedSite !== 'gallery' && <RightNav />}
        </Row>
    );
};

export default ClientLayout;
