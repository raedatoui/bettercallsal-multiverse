import React, { FC, RefObject, useEffect, useRef, useState } from 'react';
import { GameButtonBar, GameCanvas, LoadingBar, LoadingBarProgressEmpty, LoadingBarProgressFull, StopButton } from 'src/components/middle/elements';
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
        setSelectedContentItem,
        loading
    } = useSiteContext();

    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);
    const [gamesPosterSize, setGamesPosterSize] = useState<ContentSize>({ width: 640, height: 480, left: 0, top: 0 });
    const [gameProgress, setGameProgress] = useState<number>(0);
    const [gameProgressVisible, setGameProgressVisible] = useState<boolean>(false);

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
        return { width: Math.floor(width), height: Math.floor(workingHeight), left: (workingWidth - width) / 2, top: 0 };
        // return { width: 900, height: 600, left: 0, top: 0};
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
        setGameProgress(0);
        setGameProgressVisible(true);
        window.createUnityInstance(document.getElementById('unity-canvas'), {
            companyName: game.companyName,
            productName: game.productName,
            productVersion: game.productVersion,
            showBanner: false,
            dataUrl: `${CDN}${game.dataUrl}`,
            frameworkUrl: `${CDN}${game.frameworkUrl}`,
            codeUrl: `${CDN}${game.codeUrl}`,
            streamingAssetsUrl: `${CDN}${game.streamingAssetsUrl}`,
        }, (progress) => {
            setGameProgress(progress * 100);
        })
            .then((c) => {
                setUnityInstance(c);
                setGameProgressVisible(false);
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
                desired.width = 900;
            if (selectedContentItem.category === 'pacman')
                desired.width = 600;
            setGamesPosterSize(getContentSize(desired));
        }
        if (selectedContentItem && selectedContentItem.contentType === 'gallery') {
            const r = document.getElementById('content-row');
            if (r) {
                r.style.overflow = 'hidden';
                const rect = r.getBoundingClientRect();
                setGamesPosterSize({ top: 0, left: 0, width: rect.width, height: rect.height });
            }
        }

    }, [windowSize, selectedContentItem]);

    const handleClick = async () => {
        if (selectedSite === 'gallery') {
            const l = document.getElementById('main-header');
            // @ts-ignore
            l.style.display = 'none';

            const r = document.getElementById('content-row');
            if (r) {
                const rect = r.getBoundingClientRect();
                setGamesPosterSize({ top: 0, left: 0, width: rect.width, height: rect.height });
            }
        }

    };

    useEffect(() => {
        if (selectedSite === 'gallery' && !loading)
            setSelectedContentItem(contentMap.gallery[0]);
    }, [selectedSite, loading]);

    return (
        <>
            { gameProgressVisible && (
                <LoadingBar>
                    <LoadingBarProgressEmpty>
                        <LoadingBarProgressFull width={gameProgress} />
                    </LoadingBarProgressEmpty>
                </LoadingBar>
            ) }

            <GameCanvas
                ref={canvasRef}
                id="unity-canvas"
                height={gamesPosterSize.height}
                width={gamesPosterSize.width}
                left={gamesPosterSize.left}
                onClick={handleClick}
                className={selectedContentItem
                && (selectedContentItem.contentType === 'game' || selectedContentItem.contentType === 'gallery') ? 'on' : 'off'}
            />
            { selectedContentItem && selectedContentItem.contentType === 'game' && (
                <GameButtonBar left={gamesPosterSize.width + gamesPosterSize.left - 83} top={gamesPosterSize.height - 2}>
                    <StopButton onClick={() => handleStop()}>BACK</StopButton>
                </GameButtonBar>
            ) }
        </>
    );
};
