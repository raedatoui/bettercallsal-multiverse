/* eslint-disable max-len */
import Script from 'next/script';
import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import LawBreakers from '@/components/footer';
import ParticleSystem from '@/components/glfx';
import HeaderComponent from '@/components/header';
import { breakPoints, CDN } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { PathProvider } from '@/providers/path';
import { useSiteContext } from '@/providers/sites';
import { Main, Row2 } from '@/styles/sharedstyles';
import { animateCounterBizerk } from '@/utils/gsap';

const PrivacyContainer = styled.div`
    width: 60%;
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;
    font-family: Pragmatica, Arial, Helvetica, sans-serif;
    font-size: 20px;
    text-transform: uppercase;
    font-stretch: expanded;
    color: #232323;
    overflow-wrap: break-word;
    p {
        margin: 20pt 0;
        &:last-child {
            padding-bottom: 20pt;
        }
    }
    @media only screen and (max-width: ${breakPoints.sm.max}px) {
        width: 100%;
        inline-size: 90%;
        padding: 0;
        font-size: 16px;
    }
`;
const MainContainerInner = () => {
    const { selectedSite, fullScreen } = useSiteContext();
    const { setBizerkMode, animateGrid, setAnimateGrid } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

    const cursor = `${CDN}/images/${selectedSite}/cursor.webp`;

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [screenCapture, setScreeCapture] = useState<string | null>(null);

    const mainRef = useRef<HTMLDivElement | null>(null);
    const particleRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        if (mainRef.current && screenCapture === null && scriptLoaded && (selectedSite === 'construction' || target.id === 'bizerk-icon'))
            window.htmlToImage
                .toPng(mainRef.current)
                .then((dataUrl) => {
                    setScreeCapture(dataUrl);
                    setBizerkMode('on');
                    animateCounterBizerk(animateGrid, setAnimateGrid, false);
                    if (buffers.analyzer && particleRef.current)
                        // eslint-disable-next-line no-new
                        new ParticleSystem(dataUrl, particleRef.current, buffers.analyzer);
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
    };

    return (
        <>
            <style jsx global>
                {`
                    body {
                        cursor: url('${cursor}'), auto;
                    }
                `}
            </style>

            <Script src="/scripts/html-to-image.js" onReady={() => setScriptLoaded(true)} />
            <PathProvider>
                <Main onClick={handleClick} id="main" ref={mainRef} className={fullScreen ? 'fullScreen' : ''}>
                    <HeaderComponent />
                    <Row2 id="content-row">
                        <PrivacyContainer>
                            <p>
                                <strong>
                                    <span>Privacy Policy for &quot;Better Call Sal World&quot;</span>
                                </strong>
                            </p>
                            <p>
                                <strong>
                                    <span>Last updated: [12/18/2023]</span>
                                </strong>
                            </p>
                            <p>
                                <strong>
                                    <span>1. Introduction</span>
                                </strong>
                            </p>
                            <p>
                                <span>
                                    Welcome to &quot;Better Call Sal World&quot;. This Privacy Policy is designed to inform you about the types of
                                    information we may collect, how we use that information, and the choices you have regarding your personal data.
                                </span>
                            </p>
                            <p>
                                <strong>
                                    <span>2. Information We Collect</span>
                                </strong>
                            </p>
                            <p>
                                <span>
                                    We do not collect any personal data or sensitive information from users of &quot;Better Call Sal World.&quot; Our
                                    commitment is to user privacy, and we do not gather, store, or process any data that could be used to identify
                                    individuals.
                                </span>
                            </p>
                            <p>
                                <strong>
                                    <span>3. How We Use Your Information</span>
                                </strong>
                            </p>
                            <p>
                                <span>
                                    Since we do not collect any personal information, we do not use it for any purpose. Your privacy is important to
                                    us, and we have designed our game to function without the need for data collection.
                                </span>
                            </p>
                            <p>
                                <strong>
                                    <span>4. Third-Party Access</span>
                                </strong>
                            </p>
                            <p>
                                <span>
                                    We do not share any user data with third parties. Your information is solely used within the app and is not
                                    disclosed, sold, or transferred to any external entities.
                                </span>
                            </p>
                            <p>
                                <strong>
                                    <span>5. Analytics and Crash Reporting</span>
                                </strong>
                            </p>
                            <p>
                                <span>
                                    Our app may use Apple&apos;s built-in analytics and crash reporting services to improve the user experience.
                                    However, these services do not collect personal information and are used solely for the purpose of app performance
                                    and bug resolution.
                                </span>
                            </p>
                            <p>
                                <strong>
                                    <span>6. Changes to This Privacy Policy</span>
                                </strong>
                            </p>
                            <p>
                                <span>
                                    We reserve the right to update our Privacy Policy to reflect changes in our practices and for legal or regulatory
                                    reasons.
                                </span>
                            </p>
                            <p>
                                <strong>
                                    <span>7. Contact Us</span>
                                </strong>
                            </p>
                            <p>
                                <span>
                                    If you have any questions or concerns about this Privacy Policy, please contact us at bettercallsalworld@gmail.com
                                </span>
                            </p>
                        </PrivacyContainer>
                    </Row2>
                    <LawBreakers />
                </Main>
            </PathProvider>

            <div id="particles" ref={particleRef} />
        </>
    );
};

export default MainContainerInner;
