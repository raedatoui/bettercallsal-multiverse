import React, { FC, useContext, useEffect } from 'react';
import { Main } from 'src/styles/sharedstyles';
import { useSiteContext } from 'src/providers/sites';
// import { WindowSizeContext } from 'src/providers/window-size';
import { SiteKey } from 'src/types';
import { CDN } from 'src/constants';
import { AnimationContext } from 'src/providers/animations';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const keyMap: Record<string, SiteKey> = {
    a: 'art',
    b: 'biz',
    f: 'fit',
    r: 'rocks',
    g: 'games',
    c: 'construction',
    y: 'gallery',
};

export const MainContainer: FC<Props> = ({ children }) => {
    const { selectedSite, setSelectedSite, setFullScreen, fullScreen } = useSiteContext();
    const { keyPressed } = useContext(AnimationContext);

    const cursor = `${CDN}/images/${selectedSite}/cursor.webp`;

    useEffect(() => {
        if (keyPressed === 'Escape' && fullScreen)
            // const l = document.getElementById('main-header');
            // // @ts-ignore
            // l.style.display = 'block';
            setFullScreen(false);

        if (keyPressed && keyMap[keyPressed] !== undefined && selectedSite !== 'gallery')
            setSelectedSite(keyMap[keyPressed]);
    }, [keyPressed, selectedSite]);

    return (
        <Main
            id="main"
            className={fullScreen ? 'fullScreen' : ''}
        >
            <style jsx global>{`
                body {
                  cursor: url("${cursor}"), auto;
                }
              `}
            </style>

            {children}
        </Main>
    );
};
