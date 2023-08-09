import Script from 'next/script';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CDN } from '@/constants';
import { useSiteContext } from '@/providers/sites';
import { ButtonBar, GameCanvas, LoadingBar, LoadingBarProgressEmpty, LoadingBarProgressFull, StopButton } from '@/styles/sharedstyles';
import { BaseContentItem, ContentSize, GameContentItem, isGame, Size, UnityInstance, VisibleProps, } from '@/types';
import { findGame, useWindowSize } from '@/utils';

const Unity:FC<VisibleProps> = () => {
    const navigate = useNavigate();
    const { gameId } = useParams<{ gameId: string }>();

    const {
        contentMap,
        selectedSite,
        loading,
        fullScreen,
        setFullScreen
    } = useSiteContext();
    const contentList = contentMap[selectedSite];

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [game, setGame] = useState<GameContentItem | null>(null);
    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);
    const [gamesPosterSize, setGamesPosterSize] = useState<ContentSize>({ width: 640, height: 480, left: 0, top: 0 });
    const [gameProgress, setGameProgress] = useState<number>(0);
    const [gameProgressVisible, setGameProgressVisible] = useState<boolean>(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const windowSize = useWindowSize();

    const getContentSize = useCallback((desiredSize: Size): ContentSize => {
        let height: number;
        let width: number;

        const workingWidth = document?.getElementById('middle')?.getBoundingClientRect().width ?? 0;
        const workingHeight = document?.getElementById('content-row')?.getBoundingClientRect().height ?? 0;

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
    }, []);

    const handleStop = useCallback(() => {
        if (unityInstance)
            unityInstance.Quit().then(() => {
                setUnityInstance(null);
                navigate('/');
            });
    }, [navigate, unityInstance]);

    const loadGame = useCallback(() => {
        setGameProgress(0);
        setGameProgressVisible(true);
        if (game)
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
            }).then((c) => {
                setUnityInstance(c);
                setGameProgressVisible(false);
            });
    }, [game]);

    const clearCanvas = useCallback(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('webgl2');
            context?.clear(0);
        }
    }, []);

    const getGame = (l: (BaseContentItem | GameContentItem)[]) => {
        if (selectedSite === 'gallery') {
            const g: readonly GameContentItem[] = l.filter(isGame);
            if (g.length > 0)
                return g[0];
            return null;
        }
        return findGame(contentList, gameId ?? '');
    };

    const getGameCb = useCallback(():GameContentItem | null => getGame(contentList), [selectedSite, contentList, gameId]);

    useEffect(() => {
        if (game) {
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
        return () => {};
    }, [selectedSite, game, clearCanvas, loadGame]);

    useEffect(() => {
        if (game) {
            const desired = { width: 1000, height: 600 };
            if (game.category === 'supersalbros')
                desired.width = 900;
            if (game.category === 'pacman')
                desired.width = 600;
            setGamesPosterSize(getContentSize(desired));
        }
        if (game && game.contentType === 'gallery') {
            const r = document.getElementById('content-row');
            if (r) {
                r.style.overflow = 'hidden';
                const rect = r.getBoundingClientRect();
                setGamesPosterSize({ top: 0, left: 0, width: rect.width, height: rect.height });
            }
        }
        return () => {};
    }, [windowSize, game, getContentSize]);

    useEffect(() => {
        const r = document.getElementById('content-row');
        if (r) {
            const rect = r.getBoundingClientRect();
            setGamesPosterSize({ top: 0, left: 0, width: rect.width, height: rect.height });
        }
        return () => {};
    }, [fullScreen]);

    useEffect(() => {
        if (scriptLoaded) {
            const g = getGameCb();
            if (!g) navigate('/');
            setGame(g);
        }
    }, [gameId, contentList, scriptLoaded]);

    const handleClick = async () => {
        if (selectedSite === 'gallery')
            setFullScreen(true);
    };

    const loader = selectedSite === 'gallery' ? 'gallery' : 'game';

    return (
        <>
            { !loading && contentList.length && (
                <Script
                    src={`${CDN}/unity/${loader}.loader.js`}
                    onReady={() => {
                        const g = getGame(contentList);
                        if (!g) navigate('/');
                        else setGame(g);
                        setScriptLoaded(true);
                    }}
                />
            ) }

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
                className={scriptLoaded && game ? 'on' : 'off'}
            />
            { game && game.contentType !== 'gallery' && (
                <ButtonBar>
                    <StopButton onClick={() => handleStop()}>[x]</StopButton>
                </ButtonBar>
            ) }
        </>
    );
};

export default Unity;
