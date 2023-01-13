import React, { FC, useEffect, useState } from 'react';
import { GameButtonBar, GameCanvas, StopButton } from 'src/components/middle/elements';
import Script from 'next/script';
import { UnityInstance } from 'src/types';

interface Props {
    width: number;
    height: number;
    left: number;
    deselect: () => void;
    scriptLoaded: boolean;
    setScriptLoaded: (b: boolean) => void;
}

export const UnityGame: FC<Props> = ({ setScriptLoaded, scriptLoaded, width, height, left, deselect }) => {
    const [unityInstance, setUnityInstance] = useState<UnityInstance>();
    useEffect(() => {
        if (scriptLoaded && window && window.createUnityInstance !== undefined)
            window.createUnityInstance(document.getElementById('unity-canvas'), {
                dataUrl: '/unity/SUPERSALBROS.data',
                frameworkUrl: '/unity/SUPERSALBROS.framework.js',
                codeUrl: '/unity/SUPERSALBROS.wasm',
                streamingAssetsUrl: '/unity//StreamingAssets',
                companyName: 'BetterCallSal.games',
                productName: 'Super Sal Bros.',
                productVersion: '1.0',
                // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
            }).then((c) => {
                setUnityInstance(c);
            });

    }, [scriptLoaded]);

    const handleStop = () => {
        if (unityInstance)
            unityInstance.Quit().then(() => {
                deselect();
            });
    };
    return (
        <>
            <Script
                src="/unity/SUPERSALBROS.loader.js"
                onLoad={() => setScriptLoaded(true)}
            />
            <GameCanvas id="unity-canvas" height={height} width={width} left={left} />
            <GameButtonBar left={width + left - 83 }>
                <StopButton onClick={() => handleStop()}>BACK</StopButton>
            </GameButtonBar>

        </>
    );
};
