import Script from 'next/script';
import React, { FC, useEffect, useRef, useState } from 'react';
import { VideoPlayer, VideoPlayerType } from '@/components/video/player';
import { Caption, PlayerContainer } from '@/styles/sharedstyles';
import { BaseContentItem } from '@/types';

interface YTProps {
    contentItem: BaseContentItem;
}

export const Youtube: FC<YTProps> = ({ contentItem }) => {
    const [ytScriptLoaded, setYtScriptLoaded] = useState<boolean>(false);
    const videoPlayerRef = useRef<VideoPlayerType>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.onYouTubeIframeAPIReady = () => {
            setYtScriptLoaded(true);
        };
    }, []);

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

            <Caption ref={titleRef} className="animatable">
                {contentItem?.caption ?? ''}
            </Caption>
            {ytScriptLoaded && contentItem && (
                <VideoPlayer autoPlay={false} contentItem={contentItem} titleRef={titleRef} ref={videoPlayerRef} containerRef={containerRef} />
            )}
        </PlayerContainer>
    );
};
