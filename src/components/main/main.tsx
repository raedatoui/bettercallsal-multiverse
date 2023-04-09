import React, { FC, useEffect, useRef, useState } from 'react';
import { Main } from 'src/styles/sharedstyles';
import { useSiteContext } from 'src/providers/sites';
import { SiteKey } from 'src/types';
import { CDN } from 'src/constants';
import Script from 'next/script';
import Scene from 'src/components/main/particles';

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
    const { keyPressed, selectedSite, setSelectedSite, setFullScreen, fullScreen, setBizerkOn } = useSiteContext();

    const cursor = `${CDN}/images/${selectedSite}/cursor.webp`;

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [bizerk, setBizerk] = useState<string | null >(null);

    const mainRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (keyPressed === 'Escape' && fullScreen)
            setFullScreen(false);
        if (keyPressed && keyMap[keyPressed] !== undefined && selectedSite !== 'gallery')
            setSelectedSite(keyMap[keyPressed]);
    }, [keyPressed, selectedSite]);

    useEffect(() => {
        if (bizerk) {
            const img = new Image();
            img.className = 'screencap';
            img.src = bizerk;
            document.body.appendChild(img);
        }
    }, [bizerk]);

    const handleClick = () => {
        if (mainRef.current && bizerk === null && scriptLoaded)
            window.htmlToImage.toPng(mainRef.current)
                .then((dataUrl) => {
                    setBizerk(dataUrl);
                    setBizerkOn(true);
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
    };

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
            { bizerk && <Scene image={bizerk} /> }
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
