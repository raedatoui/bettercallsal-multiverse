import React, {FC, KeyboardEvent, useContext, useEffect, useState} from 'react';
import { Main, NavButton, Overlay } from 'src/styles/sharedstyles';
import { Caption, StopButton } from 'src/components/middle/elements';
import { SiteContext } from 'src/providers/sites';
import styled from 'styled-components';
import Image from 'next/image';
import { WindowSizeContext } from 'src/providers/window-size';
import { BaseContentItem, SiteKey } from 'src/types';
import { CDN, KEYBOARD_SWITCHING } from 'src/constants';

interface Props {
    children: JSX.Element[];
}

const SlideItem = styled(NavButton)`
  position: absolute;
  padding: 4px 6px;
  top: 50%;
  &.left {
    left: 5px;
  }
  
  &.right {
    right: 5px;
  }
`;

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
