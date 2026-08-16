'use client';

import Script from 'next/script';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePathContext } from '@/providers/path';
import { useSiteContext } from '@/providers/sites';
import { ButtonBar, PlayerContainer, StopButton, VideoText } from '@/styles/sharedstyles';
import { findContent } from '@/utils';
import { VideoPlayer, VideoPlayerType } from './player';

export const Video = () => {
    const { pathStack } = usePathContext();
    const { slug: videoId } = useParams<{ slug: string }>();
    const router = useRouter();

    const [ytScriptLoaded, setYtScriptLoaded] = useState<boolean>(false);
    const [vmScriptLoaded, setVmScriptLoaded] = useState<boolean>(false);
    const { contentMap, selectedSite, siteMap } = useSiteContext();
    const site = siteMap[selectedSite];
    const contentList = contentMap[selectedSite];
    const contentItem = findContent(contentList, videoId ?? '');

    const videoPlayerRef = useRef<VideoPlayerType>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const viewsRef = useRef<HTMLDivElement>(null);

    const getTile = () => {
        if (contentItem?.site === 'biz' || contentItem?.site === 'rocks')
            return `${contentItem?.caption ?? ''}: ${site.header.name1} ${site.header.name2}`;
        return contentItem?.caption ?? '';
    };

    const stopVideo = useCallback(() => {
        videoPlayerRef.current?.stop();

        if (pathStack.length >= 1) {
            const p = pathStack[pathStack.length - 1];
            if (/\/category\/.*/.test(p)) router.back();
            else router.push('/');
        } else router.push('/');
    }, [router, pathStack]);

    useEffect(() => {
        window.onYouTubeIframeAPIReady = () => {
            setYtScriptLoaded(true);
        };
    }, []);

    if (!contentItem) router.push('/');

    const videoClass = contentItem?.contentId ? 'loaded' : '';
    return (
        <PlayerContainer className={videoClass} ref={containerRef}>
            <Script
                id="youtube-iframe"
                src="https://www.youtube.com/iframe_api"
                onReady={() => {
                    if (window.YT.Player) setYtScriptLoaded(true);
                }}
            />
            <Script id="vimeo-player" src="https://player.vimeo.com/api/player.js" onReady={() => setVmScriptLoaded(true)} />

            {contentItem?.caption && <VideoText ref={titleRef}>{getTile()}</VideoText>}

            {ytScriptLoaded && vmScriptLoaded && contentItem && (
                <VideoPlayer
                    autoPlay
                    contentItem={contentItem}
                    containerRef={containerRef}
                    titleRef={titleRef}
                    viewsRef={viewsRef}
                    ref={videoPlayerRef}
                />
            )}

            {contentItem?.views && (
                <VideoText className="lower" ref={viewsRef}>
                    Views: {contentItem?.views?.toLocaleString('US') ?? ''}
                </VideoText>
            )}

            <ButtonBar>
                <StopButton onClick={() => stopVideo()}>[x]</StopButton>
            </ButtonBar>
        </PlayerContainer>
    );
};