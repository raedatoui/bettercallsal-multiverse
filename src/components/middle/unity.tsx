import React, { FC, RefObject, useEffect, useRef, useState } from 'react';
import { GameButtonBar, GameCanvas, StopButton } from 'src/components/middle/elements';
import { ContentSize, GameContentItem, Size, UnityInstance } from 'src/types';
import { CDN } from 'src/constants';
import { useSiteContext } from 'src/providers/sites';
import { useWindowSize } from 'src/utils';

interface Props {
    containerRef: RefObject<HTMLDivElement>
}

export const UnityGame: FC<Props> = ({ containerRef }) => {
    const {
        contentMap,
        selectedSite,
        setSelectedNavItem,
        selectedContentItem,
        setSelectedContentItem
    } = useSiteContext();

    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);
    const [gamesPosterSize, setGamesPosterSize] = useState<ContentSize>({ width: 640, height: 480, left: 0, top: 0 });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const windowSize = useWindowSize();

    const getContentSize = (desiredSize: Size): ContentSize => {
        let height: number;
        let width: number;
        const workingWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
        const workingHeight = (document?.getElementById('content-row')?.getBoundingClientRect().height ?? 0);

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

        // return { width, height, left: (workingWidth - width) / 2, top: (workingHeight - height) / 2 };

        // this was an attempt at full bleeing the game
        return { width, height: workingHeight, left: (workingWidth - width) / 2, top: 0 };
        // return { width: workingWidth, height: workingHeight, left: 0, top: 0};
    };

    const handleStop = () => {
        if (unityInstance)
            unityInstance.Quit().then(() => {
                setSelectedContentItem(null);
                setSelectedNavItem(null);
                setUnityInstance(null);
            });
    };

    const loadGame = () => {
        const game = selectedContentItem as GameContentItem;
        window.createUnityInstance(document.getElementById('unity-canvas'), {
            ...game,
            dataUrl: `${CDN}${game.dataUrl}`,
            frameworkUrl: `${CDN}${game.frameworkUrl}`,
            codeUrl: `${CDN}${game.codeUrl}`,
            streamingAssetsUrl: `${CDN}${game.streamingAssetsUrl}`,
            matchWebGLToCanvasSize: true
        })
            .then((c) => {
                setUnityInstance(c);
            });
    };

    const clearCanvas = () => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('webgl2');
            context?.clear(0);
        }
    };

    useEffect(() => {
        if (selectedContentItem && (selectedContentItem.contentType === 'game' || selectedContentItem.contentType === 'gallery')) {
            clearCanvas();
            if (unityInstance)
                unityInstance.Quit()
                    .then(() => {
                        setUnityInstance(null);
                        loadGame();
                    });
            else loadGame();
        }

        if (selectedSite !== 'games' && unityInstance)
            unityInstance.Quit().then(() => {
                setUnityInstance(null);
            });

    }, [selectedSite, selectedContentItem]);

    useEffect(() => {
        if (selectedContentItem && selectedContentItem.contentType === 'game') {
            const desired = { width: 1000, height: 600 };
            if (selectedContentItem.category === 'supersalbros')
                desired.width = 960;
            if (selectedContentItem.category === 'pacman')
                desired.width = 600;
            setGamesPosterSize(getContentSize(desired));
        }
        if (selectedContentItem && selectedContentItem.contentType === 'gallery') {
            const r = document.getElementById('content-row');
            if (r) {
                const rect = r.getBoundingClientRect();
                setGamesPosterSize({ top: 0, left: 0, width: rect.width, height: rect.height });
            }
        }

    }, [windowSize, selectedContentItem]);

    useEffect(() => {
        if (selectedSite === 'gallery')
            setSelectedContentItem(contentMap.gallery[0]);
    }, [selectedSite]);

    return (
        <>
            <GameCanvas
                ref={canvasRef}
                id="unity-canvas"
                height={gamesPosterSize.height}
                width={gamesPosterSize.width}
                left={gamesPosterSize.left}
                className={selectedContentItem
                && (selectedContentItem.contentType === 'game' || selectedContentItem.contentType === 'gallery') ? 'on' : 'off'}
            />
            { selectedContentItem && selectedContentItem.contentType === 'game' && (
                <GameButtonBar left={gamesPosterSize.width + gamesPosterSize.left - 83} top={gamesPosterSize.height}>
                    <StopButton onClick={() => handleStop()}>BACK</StopButton>
                </GameButtonBar>
            ) }
        </>
    );
};
