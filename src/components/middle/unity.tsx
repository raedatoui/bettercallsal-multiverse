import React, { FC, RefObject, useContext, useEffect, useRef, useState } from 'react';
import { GameButtonBar, GameCanvas, StopButton } from 'src/components/middle/elements';
import { ContentSize, GameContentItem, Size, UnityInstance } from 'src/types';
import { CDN } from 'src/constants';
import { SiteContext } from 'src/providers/sites';
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
        if (selectedContentItem && selectedContentItem.contentType === 'game') {
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
        if (selectedContentItem && selectedContentItem.contentType === 'game')
            setGamesPosterSize(getContentSize(
                { width: selectedContentItem.category === 'supersalbros' ? 960 : 1000, height: 600 }
            ));
    }, [windowSize, selectedContentItem]);

    return (
        <>
            <GameCanvas
                ref={canvasRef}
                id="unity-canvas"
                height={gamesPosterSize.height}
                width={gamesPosterSize.width}
                left={gamesPosterSize.left}
                className={selectedContentItem && selectedContentItem.contentType === 'game' ? 'on' : 'off'}
            />
            { selectedContentItem && selectedContentItem.contentType === 'game' && (
                <GameButtonBar left={gamesPosterSize.width + gamesPosterSize.left - 83} top={gamesPosterSize.height}>
                    <StopButton onClick={() => handleStop()}>BACK</StopButton>
                </GameButtonBar>
            ) }
        </>
    );
};
