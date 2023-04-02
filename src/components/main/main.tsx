import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Main } from 'src/styles/sharedstyles';
import { useSiteContext } from 'src/providers/sites';
// import { WindowSizeContext } from 'src/providers/window-size';
import { SiteKey } from 'src/types';
import { CDN } from 'src/constants';
import { AnimationContext } from 'src/providers/animations';
import Script from 'next/script';

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

export const MainContainer: FC<Props> = ({ children }) => {
    const { selectedSite, setSelectedSite, setFullScreen, fullScreen } = useSiteContext();
    const { keyPressed } = useContext(AnimationContext);

    const cursor = `${CDN}/images/${selectedSite}/cursor.webp`;

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [bizerk, setBizerk] = useState<string | null >(null);

    const mainRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (keyPressed === 'Escape' && fullScreen)
            // const l = document.getElementById('main-header');
            // // @ts-ignore
            // l.style.display = 'block';
            setFullScreen(false);

        if (keyPressed && keyMap[keyPressed] !== undefined && selectedSite !== 'gallery')
            setSelectedSite(keyMap[keyPressed]);
    }, [keyPressed, selectedSite]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const downloadImage = (canvas:HTMLCanvasElement, filename:string) => {
        const link = document.createElement('a');
        link.download = filename;
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            }
        });
    };

    useEffect(() => {
        if (scriptLoaded && mainRef.current)
            mainRef.current.addEventListener('click', () => {
                if (mainRef.current) {
                    // @ts-ignore
                    const r = document.getElementById('content-row');
                    if (r)
                        r.style.overflow = 'hidden';
                    window.htmlToImage.toPng(mainRef.current)
                        .then((dataUrl) => {
                            setBizerk(dataUrl);
                        })
                        .catch((error) => {
                            console.error('oops, something went wrong!', error);
                        });
                }
            });

    }, [scriptLoaded, mainRef]);

    useEffect(() => {
        if (bizerk) {
            const img = new Image();
            img.src = bizerk;
            mainRef.current?.appendChild(img);
        }
    }, [bizerk]);

    return (
        <Main
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

            { !bizerk && children}
        </Main>
    );
};
