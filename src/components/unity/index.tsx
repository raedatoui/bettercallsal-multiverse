import Script from 'next/script';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CDN } from '@/constants';
import { useSiteContext } from '@/providers/sites';
import { ButtonBar, LoadingBar, LoadingBarProgressEmpty, LoadingBarProgressFull, StopButton } from '@/styles/sharedstyles';
import { BaseContentItem, ContentSize, GameContentItem, isGame, Size, UnityInstance } from '@/types';
import { findGame, useWindowSize } from '@/utils';

const Unity = () => {
    const navigate = useNavigate();
    const { gameId } = useParams<{ gameId: string }>();
    const canvasRef = document.getElementById('unity-canvas') as HTMLCanvasElement;

    const { contentMap, selectedSite, loading, fullScreen, setFullScreen } = useSiteContext();
    const contentList = contentMap[selectedSite];

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [game, setGame] = useState<GameContentItem | null>(null);
    const [gameProgress, setGameProgress] = useState<number>(0);
    const [gameProgressVisible, setGameProgressVisible] = useState<boolean>(false);
    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);

    const windowSize = useWindowSize();

    const getContentSize = useCallback((desiredSize: Size): ContentSize => {
        let width: number;
        const workingWidth = document?.getElementById('middle')?.getBoundingClientRect().width ?? 0;
        const workingHeight = document?.getElementById('content-row')?.getBoundingClientRect().height ?? 0;

        if (workingWidth > workingHeight) width = (workingHeight * desiredSize.width) / desiredSize.height;
        else width = workingWidth;

        if (width > workingWidth) width = workingWidth;

        return {
            width: Math.floor(width),
            height: Math.floor(workingHeight),
            left: (workingWidth - width) / 2,
            top: 0,
        };
    }, []);

    const loadGame = useCallback(() => {
        setGameProgress(0);
        setGameProgressVisible(true);
        if (game) {
            const obj = {
                showBanner: false,
                dataUrl: `${CDN}${game.dataUrl}`,
                frameworkUrl: `${CDN}${game.frameworkUrl}`,
                codeUrl: `${CDN}${game.codeUrl}`,
                streamingAssetsUrl: `${CDN}${game.assetsUrl}`,
                companyName: 'Better Call Sal',
                productVersion: '1.0',
                productName: game.name,
            };
            window
                .createUnityInstance(document.getElementById('unity-canvas'), obj, (progress) => {
                    setGameProgress(progress * 100);
                })
                .then((c) => {
                    setUnityInstance(c);
                    setGameProgressVisible(false);
                });
        }
    }, [game]);

    const clearCanvas = useCallback(() => {
        if (canvasRef) {
            const context = canvasRef.getContext('webgl2');
            context?.clear(0);
        }
    }, []);

    const getGame = (l: (BaseContentItem | GameContentItem)[]) => {
        if (selectedSite === 'gallery') {
            const g: readonly GameContentItem[] = l.filter(isGame);
            if (g.length > 0) return g[0];
            return null;
        }
        return findGame(contentList, gameId ?? '');
    };

    const getGameCb = useCallback((): GameContentItem | null => getGame(contentList), [selectedSite, contentList, gameId]);

    useEffect(() => {
        if (game) {
            clearCanvas();
            if (unityInstance)
                unityInstance.Quit().then(() => {
                    setUnityInstance(null);
                    loadGame();
                });
            else loadGame();
        }

        if (selectedSite !== 'games' && unityInstance) {
            if (canvasRef) {
                const context = canvasRef.getContext('webgl2');
                context?.clear(0);
                canvasRef.style.display = 'none';
            }
            if (unityInstance) unityInstance.Quit();
        }
    }, [selectedSite, game, clearCanvas, loadGame]);

    useEffect(() => {
        const r = document.getElementById('content-row');
        const rect = r?.getBoundingClientRect();
        if (game) {
            if (game.contentId === 'gallery' && selectedSite === 'gallery') {
                if (r && rect) {
                    r.style.overflow = 'hidden';
                    if (canvasRef) {
                        canvasRef.style.width = `${rect.width}px`;
                        canvasRef.style.height = `${rect.height}px`;
                        canvasRef.style.marginLeft = '0px';
                        canvasRef.style.display = 'block';
                    }
                }
                return;
            }
            const desired = { width: rect?.width ?? 1000, height: rect?.height ?? 600 };
            if (game.contentId === 'super-sal-bros') desired.width = 900;
            if (game.contentId === 'sal-man') desired.width = 600;

            const props = getContentSize(desired);
            if (canvasRef) {
                canvasRef.style.width = `${props.width}px`;
                canvasRef.style.height = `${props.height}px`;
                canvasRef.style.marginLeft = `${props.left}px`;
                canvasRef.style.display = 'block';
            }
        }
    }, [windowSize, game, getContentSize]);

    useEffect(() => {
        const r = document.getElementById('content-row');
        if (r) {
            const rect = r.getBoundingClientRect();
            if (canvasRef) {
                canvasRef.style.width = `${rect.width}px`;
                canvasRef.style.height = `${rect.height}px`;
                canvasRef.style.marginLeft = '0px';
                canvasRef.style.display = 'block';
            }
        }
    }, [fullScreen]);

    useEffect(() => {
        if (scriptLoaded) {
            const g = getGameCb();
            if (!g) navigate('/');
            setGame(g);
        }
    }, [gameId, contentList, scriptLoaded]);

    const handleClick = async () => {
        if (selectedSite === 'gallery') setFullScreen(true);
    };

    useEffect(() => {
        if (canvasRef) canvasRef.style.display = 'block';
        return () => {
            if (canvasRef) {
                const context = canvasRef.getContext('webgl2');
                context?.clear(0);
                canvasRef.style.display = 'none';
            }
            if (unityInstance) unityInstance.Quit();
        };
    }, [unityInstance, canvasRef]);

    let loader = selectedSite === 'gallery' ? 'gallery' : 'game';
    if (selectedSite === 'world') loader = 'world';

    if (canvasRef) canvasRef.addEventListener('click', handleClick);

    return (
        <>
            {!loading && contentList.length && (
                <Script
                    src={`${CDN}/unity/${loader}.loader.js`}
                    onReady={() => {
                        const g = getGame(contentList);
                        if (!g) navigate('/');
                        else setGame(g);
                        setScriptLoaded(true);
                    }}
                />
            )}

            {gameProgressVisible && (
                <LoadingBar>
                    <LoadingBarProgressEmpty>
                        <LoadingBarProgressFull width={gameProgress} />
                    </LoadingBarProgressEmpty>
                </LoadingBar>
            )}

            {game && selectedSite !== 'gallery' && (
                <ButtonBar>
                    <StopButton onClick={() => navigate('/')}>[x]</StopButton>
                </ButtonBar>
            )}
        </>
    );
};

export default Unity;
