import React, { FC, useEffect, useState } from 'react';
import { GameButtonBar, GameCanvas, StopButton } from 'src/components/middle/elements';
import { GameContentItem, UnityInstance } from 'src/types';
import { CDN } from 'src/constants';

interface Props {
    width: number;
    height: number;
    left: number;
    deselect: () => void;
    game: GameContentItem | null;
}

export const UnityGame: FC<Props> = ({ width, height, left, deselect, game }) => {
    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);

    useEffect(() => {
        console.log(game, unityInstance);
        if (game && !unityInstance)
            window.createUnityInstance(document.getElementById('unity-canvas'), {
                ...game,
                dataUrl: `${CDN}${game.dataUrl}`,
                frameworkUrl: `${CDN}${game.frameworkUrl}`,
                codeUrl: `${CDN}${game.codeUrl}`,
                streamingAssetsUrl: `${CDN}${game.streamingAssetsUrl}`,
            }).then((c) => {
                setUnityInstance(c);
            });

        if (!game && unityInstance)
            unityInstance.Quit().then(() => {
                deselect();
                setUnityInstance(null);
            });

    }, [game, unityInstance]);

    const handleStop = () => {
        if (unityInstance)
            unityInstance.Quit().then(() => {
                deselect();
            });
    };
    return (
        <>
            { game && <GameCanvas id="unity-canvas" height={height} width={width} left={left} /> }
            { game && (
                <GameButtonBar left={width + left - 83} top={height}>
                    <StopButton onClick={() => handleStop()}>BACK</StopButton>
                </GameButtonBar>
            ) }
        </>
    );
};
