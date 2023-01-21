import React, { FC, KeyboardEvent, useContext, useEffect } from 'react';
import { Main } from 'src/styles/sharedstyles';
import { SiteContext } from 'src/providers/sites';
import { WindowSizeContext } from 'src/providers/window-size';
import { SiteKey } from 'src/types';
import { CDN, KEYBOARD_SWITCHING } from 'src/constants';

interface Props {
    children: JSX.Element[];
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
    const { selectedSite, setSelectedSite } = useContext(SiteContext);
    const cursor = `${CDN}/images/${selectedSite}/cursor.png`;

    const handleKeyEvent = (keyEvent: KeyboardEvent<HTMLElement>) => {
        if (keyMap[keyEvent.key] !== undefined)
            setSelectedSite(keyMap[keyEvent.key]);
    };

    const { height } = useContext(WindowSizeContext);

    useEffect(() => {
        if (height < 600) {
            document.body.style.overflowY = 'auto';
            document.body.style.height = 'auto';
            // @ts-ignore
            document.getElementById('content-row').style.overflowY = 'hidden';
        } else {
            document.body.style.height = '100%';
            document.body.style.overflowY = 'hidden';
            // @ts-ignore
            document.getElementById('content-row').style.overflowY = 'auto';
        }
    }, [height]);

    return (
        <Main
            id="main"
            tabIndex={KEYBOARD_SWITCHING ? 0 : undefined}
            onKeyPress={(event) => handleKeyEvent(event)}
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
