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
};

export const MainContainer: FC<Props> = ({ children }) => {
    const { selectedSite, setSelectedSite } = useSiteContext();
    const { keyPressed } = useContext(AnimationContext);

    const cursor = `${CDN}/images/${selectedSite}/cursor.webp`;

    // const { height, width } = useContext(WindowSizeContext);

    // useEffect(() => {
    //     if (height < 600 && width > 1024) {
    //         document.body.style.overflowY = 'auto';
    //         document.body.style.height = 'auto';
    //         // @ts-ignore
    //         // document.getElementById('content-row').style.overflowY = 'hidden';
    //     } else if (width < 460) {
    //         document.body.style.overflowY = 'auto';
    //         document.body.style.height = 'auto';
    //     } else {
    //         document.body.style.height = '100%';
    //         document.body.style.overflowY = 'hidden';
    //         // @ts-ignore
    //         // document.getElementById('content-row').style.overflowY = 'auto';
    //     }
    // }, [height, width]);

    useEffect(() => {
        if (keyPressed && keyMap[keyPressed] !== undefined)
            setSelectedSite(keyMap[keyPressed]);
    }, [keyPressed]);

    return (
        <Main
            id="main"
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
