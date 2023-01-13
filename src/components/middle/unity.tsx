import React, { FC, useEffect, useMemo, useState } from 'react';
import { GameButtonBar, GameCanvas, StopButton } from 'src/components/middle/elements';
import { GameContentItem, UnityInstance } from 'src/types';
import { CDN } from 'src/constants';

interface Props {
    width: number;
    height: number;
    left: number;
    deselect: () => void;
    game: GameContentItem;
}

export const UnityGame: FC<Props> = ({ width, height, left, deselect, game }) => {
    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);

    const instance = useMemo<UnityInstance | null>(() => unityInstance ?? null, [unityInstance]);

    useEffect(() => {
        if (window && window.createUnityInstance !== undefined && instance === null)
            window.createUnityInstance(document.getElementById('unity-canvas'), {
                ...game,
                dataUrl: `${CDN}${game.dataUrl}`,
                frameworkUrl: `${CDN}${game.frameworkUrl}`,
                codeUrl: `${CDN}${game.codeUrl}`,
                streamingAssetsUrl: `${CDN}${game.streamingAssetsUrl}`,
            }).then((c) => {
                setUnityInstance(c);
            });

    }, []);

    const handleStop = () => {
        if (instance)
            instance.Quit().then(() => {
                deselect();
            });
    };
    return (
        <>
            <GameCanvas id="unity-canvas" height={height} width={width} left={left} />
            <GameButtonBar left={width + left - 83}>
                <StopButton onClick={() => handleStop()}>BACK</StopButton>
            </GameButtonBar>
        </>
    );
};
