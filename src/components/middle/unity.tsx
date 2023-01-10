import React, { FC, useEffect, useState } from 'react';
import { GameCanvas } from 'src/components/middle/elements';
import Script from 'next/script';

interface Props {
    width: number;
    height: number;
    left: number;
}

export const UnityGame: FC<Props> = ({ width, height, left }) => {
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

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
            });

    }, [scriptLoaded]);

    return (
        <>
            <Script
                src="/unity/SUPERSALBROS.loader.js"
                onLoad={() => setScriptLoaded(true)}
            />
            <GameCanvas id="unity-canvas" height={height} width={width} left={left} />
        </>
    );
};
