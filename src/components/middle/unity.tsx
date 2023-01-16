import React, { FC, RefObject, useContext, useEffect, useState } from 'react';
import { GameButtonBar, GameCanvas, StopButton } from 'src/components/middle/elements';
import { ContentSize, GameContentItem, Size, UnityInstance } from 'src/types';
import { CDN } from 'src/constants';
import { SiteContext } from 'src/providers/site-provider';
import { useWindowSize } from 'src/utils';

interface Props {
    containerRef: RefObject<HTMLDivElement>
}

export const UnityGame: FC<Props> = ({ containerRef }) => {
    const {
        selectedSite,
        setSelectedNavItem,
        selectedContentItem,
        setSelectedContentItem
    } = useContext(SiteContext);

    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);
    const [gamesPosterSize, setGamesPosterSize] = useState<ContentSize>({ width: 640, height: 480, left: 0, top: 0 });

    const windowSize = useWindowSize();

    const getContentSize = (wWise: Size, desiredSize: Size): ContentSize => {
        let height: number;
        let width: number;
        const offset = 40; // (titleRef.current?.getBoundingClientRect().height ?? 0) + 40; // the 15px padding

        const workingWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
        const workingHeight = wWise.height - (document?.getElementsByTagName('header')[0]?.getBoundingClientRect().height ?? 0) - offset;

        if (workingWidth > workingHeight) {
            height = workingHeight;
            width = (height * desiredSize.width) / desiredSize.height;
        } else {
            width = workingWidth;
            height = (width * desiredSize.height) / desiredSize.width;
        }
        if (width > workingWidth) {
            width = workingWidth;
            height = (width * desiredSize.height) / desiredSize.width;
        }

        return { width, height, left: (workingWidth - width) / 2, top: (workingHeight - height) / 2 };
    };

    const handleStop = () => {
        if (unityInstance)
            unityInstance.Quit().then(() => {
                setSelectedContentItem(null);
                setSelectedNavItem(null);
                setUnityInstance(null);
            });
    };

    useEffect(() => {
        if (selectedSite === 'games' && selectedContentItem && !unityInstance) {
            const game = selectedContentItem as GameContentItem;
            window.createUnityInstance(document.getElementById('unity-canvas'), {
                ...game,
                dataUrl: `${CDN}${game.dataUrl}`,
                frameworkUrl: `${CDN}${game.frameworkUrl}`,
                codeUrl: `${CDN}${game.codeUrl}`,
                streamingAssetsUrl: `${CDN}${game.streamingAssetsUrl}`,
            }).then((c) => {
                setUnityInstance(c);
            });
        }
        if (selectedSite !== 'games' && unityInstance)
            unityInstance.Quit().then(() => {
                setUnityInstance(null);
            });

    }, [selectedSite, selectedContentItem, unityInstance]);

    useEffect(() => {
        if (selectedContentItem && selectedSite === 'games')
            setGamesPosterSize(getContentSize(windowSize, { width: 1000, height: 600 }));
    }, [windowSize, selectedContentItem]);

    return (
        <>
            <GameCanvas
                id="unity-canvas"
                height={gamesPosterSize.height}
                width={gamesPosterSize.width}
                left={gamesPosterSize.left}
                className={selectedSite === 'games' && selectedContentItem ? 'on' : 'off'}
            />
            { selectedSite === 'games' && selectedContentItem && (
                <GameButtonBar left={gamesPosterSize.width + gamesPosterSize.left - 83} top={gamesPosterSize.height}>
                    <StopButton onClick={() => handleStop()}>BACK</StopButton>
                </GameButtonBar>
            ) }
        </>
    );
};
