import Script from 'next/script';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSiteContext } from '@/providers/sites';
import { ButtonBar, PlayerContainer, StopButton, VideoText } from '@/styles/sharedstyles';
import { findContent } from '@/utils';
import { VideoPlayer, VideoPlayerType } from './player';

export const Video = () => {
    const { videoId } = useParams<{ videoId: string }>();
    const navigate = useNavigate();

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
        // if (contentItem?.site === 'fit') return site.leftNav.items.filter((i) => i.category === contentItem?.category ?? '')[0].quote ?? '';
        return contentItem?.name ?? '';
    };

    const stopVideo = useCallback(() => {
        videoPlayerRef.current?.stop();
        // DOC: this goes back to category
        if (selectedSite === 'biz') navigate('/');
        else navigate(-1);
    }, [navigate]);

    useEffect(() => {
        window.onYouTubeIframeAPIReady = () => {
            setYtScriptLoaded(true);
        };
    }, []);

    if (!contentItem) navigate('/');

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
                <VideoPlayer contentItem={contentItem} containerRef={containerRef} titleRef={titleRef} viewsRef={viewsRef} ref={videoPlayerRef} />
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
