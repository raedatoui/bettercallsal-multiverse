import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Main } from 'src/styles/sharedstyles';
import { useSiteContext } from 'src/providers/sites';
import { SiteKey } from 'src/types';
import { CDN } from 'src/constants';
import Script from 'next/script';
import ParticleSystem from 'src/components/glfx/particles';
import { SoundContext } from 'src/providers/audio-context';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const keyMap: Record<string, SiteKey> = {
    a: 'art',
    b: 'biz',
    f: 'fit',
    r: 'rocks',
    g: 'games',
    c: 'construction',
    y: 'gallery',
};

const MainContainerInner: FC<Props> = ({ children }) => {
    const { keyPressed, selectedSite, setSelectedSite, setFullScreen, fullScreen, bizerkMode, setBizerkMode } = useSiteContext();
    const { buffers } = useContext(SoundContext);

    const cursor = `${CDN}/images/${selectedSite}/cursor.webp`;

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [screenCapture, setScreeCapture] = useState<string | null >(null);

    const mainRef = useRef<HTMLDivElement | null>(null);
    const particleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (keyPressed === 'Escape' && fullScreen)
            setFullScreen(false);
        if (keyPressed && keyMap[keyPressed] !== undefined && selectedSite !== 'gallery')
            setSelectedSite(keyMap[keyPressed]);
    }, [keyPressed, selectedSite]);

    // useEffect(() => {
    //     if (screenCapture) {
    //         const img = new Image();
    //         img.className = 'screencap';
    //         img.src = screenCapture;
    //         document.body.appendChild(img);
    //     }
    // }, [screenCapture]);

    const handleClick = () => {
        if (mainRef.current && screenCapture === null && scriptLoaded && selectedSite === 'construction')
            window.htmlToImage.toPng(mainRef.current)
                .then((dataUrl) => {
                    setScreeCapture(dataUrl);
                    setBizerkMode('construction');
                    if (buffers.analyzer && particleRef.current)
                        // eslint-disable-next-line no-new
                        new ParticleSystem(dataUrl, particleRef.current, buffers.analyzer);

                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
    };

    useEffect(() => {
        if (mainRef.current && screenCapture === null && bizerkMode === 'doubleClick')
            window.htmlToImage.toPng(mainRef.current)
                .then((dataUrl) => {
                    setScreeCapture(dataUrl);
                    if (buffers.analyzer && particleRef.current)
                        // eslint-disable-next-line no-new
                        new ParticleSystem(dataUrl, particleRef.current, buffers.analyzer);

                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });

    }, [bizerkMode]);

    return (
        <Main
            onClick={handleClick}
            id="main"
            ref={mainRef}
            className={fullScreen ? 'fullScreen' : ''}
        >
            <style jsx global>{`
                body {
                  cursor: url("${cursor}"), auto;
                }
              `}
            </style>

            <Script
                src="/scripts/html-to-image.js"
                onLoad={() =>
                    setScriptLoaded(true)}
            />

            { children }
            <div id="particles" ref={particleRef} />
        </Main>
    );
};

export const MainContainer = React.memo(MainContainerInner);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const downloadImage = (canvas:HTMLCanvasElement, filename:string) => {
//     const link = document.createElement('a');
//     link.download = filename;
//     canvas.toBlob((blob) => {
//         if (blob) {
//             const url = URL.createObjectURL(blob);
//             link.href = url;
//             link.click();
//             URL.revokeObjectURL(url);
//         }
//     });
// };
