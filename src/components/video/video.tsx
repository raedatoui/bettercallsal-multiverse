import Script from 'next/script';
import React, { FC, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CDN } from '@/constants';
import { useSiteContext } from '@/providers/sites';
import { ButtonBar, Player, PlayerContainer, StopButton, VideoElement, VideoText } from '@/styles/sharedstyles';
import { BaseContentItem, ContentSize, Size, YTPlayer, VimeoPlayer } from '@/types';
import { useWindowSize, findContent } from '@/utils';

interface Props {
    contentItem: BaseContentItem;
    containerRef?: React.RefObject<HTMLDivElement>;
    titleRef?: React.RefObject<HTMLDivElement>;
    viewsRef?: React.RefObject<HTMLDivElement>;
}

interface VideoPlayerType {
    stop: () => void;
}

const getContentSize = (
    desiredSize: Size,
    containerRef?: HTMLDivElement,
    titleRef?: HTMLDivElement | null,
    viewsRef?: HTMLDivElement | null
): ContentSize => {
    let height: number;
    let width: number;
    const offset = (titleRef?.getBoundingClientRect().height ?? 0) + (viewsRef?.getBoundingClientRect().height ?? 0);
    const workingWidth = containerRef?.getBoundingClientRect().width ?? 0;
    const workingHeight = (document?.getElementById('content-row')?.getBoundingClientRect().height ?? 0) - offset;

    if (workingWidth > workingHeight) {
        height = workingHeight;
        width = (height * desiredSize.width) / desiredSize.height;
    } else {
        width = workingWidth;
        height = (width * desiredSize.height) / desiredSize.width;
    }
    if (width > workingWidth) {
        width = workingWidth;
        height = (width * desiredSize.height) / desiredSize.width;
    }
    return {
        width,
        height,
        left: (workingWidth - width) / 2,
        top: (workingHeight - height) / 2,
    };
};

const VideoPlayer = forwardRef<VideoPlayerType, Props>(({ contentItem, containerRef, viewsRef, titleRef }, ref) => {
    const navigate = useNavigate();
    const [yPlayer, setYPlayer] = useState<YTPlayer | null>(null);
    const [vPlayer, setVPlayer] = useState<VimeoPlayer | null>(null);

    const [videoSize, setVideoSize] = useState<ContentSize>({
        width: 0,
        height: 0,
        left: 0,
        top: 0,
    });
    const [ytSize, setYtSize] = useState<ContentSize>({
        width: 640,
        height: 480,
        left: 0,
        top: 0,
    });

    const windowSize = useWindowSize();

    const playerRef = useRef<HTMLDivElement>(null);

    // TODO: revisit text scaling
    // const scaleText = () => {
    //     if (window.textFit && titleRef.current)
    //         window.textFit(titleRef.current);
    // };

    // useEffect(() => {
    //     scaleText();
    // }, [windowSize, titleRef, contentItem]);
    //
    // useEffect(() => {
    //     scaleText();
    // }, []);

    const getSize = useCallback(() => {
        if (containerRef?.current) {
            if (contentItem.contentType === 'video')
                setVideoSize(getContentSize({ width: 1080, height: 1920 }, containerRef?.current, titleRef?.current, viewsRef?.current));
            if (contentItem.contentType === 'youtube' || contentItem.contentType === 'vimeo')
                setYtSize(getContentSize({ width: 640, height: 480 }, containerRef?.current, titleRef?.current, viewsRef?.current));
        }
    }, [containerRef, contentItem.contentType, titleRef, viewsRef]);

    useEffect(() => {
        getSize();
    }, [getSize, windowSize]);

    useEffect(() => {
        if (contentItem.contentType === 'youtube') {
            console.log(contentItem.contentId);
            // kill vimeo player if playing youtube from left nav.
            // the day we have vimeo or others in the left nav, we will need to stop the youtube player.
            if (vPlayer) vPlayer.pause();
            if (yPlayer) {
                yPlayer.loadVideoById(contentItem.contentId);
                getSize();
            } else
                new window.YT.Player('player', {
                    height: ytSize.height,
                    width: ytSize.width,
                    loop: 1,
                    color: 'red',
                    theme: 'light',
                    videoId: contentItem.contentId,
                    enablejsapi: 1,
                    startSeconds: 0,
                    events: {
                        onReady: (event: Record<string, unknown>) => {
                            const player = event.target as YTPlayer;
                            setYPlayer(player);
                            player.playVideo();
                        },
                        onStateChange: (event: Record<string, unknown>) => {
                            if (event.data === window.YT.PlayerState.ENDED) navigate('/');
                        },
                    },
                });
        }
    }, [contentItem, getSize, playerRef, vPlayer, yPlayer, ytSize.height, ytSize.width]);

    useEffect(() => {
        if (contentItem.contentType === 'vimeo' && playerRef.current) {
            const v = new window.Vimeo.Player('player', {
                id: contentItem.contentId,
                width: ytSize.width,
                autoplay: true,
                loop: false,
            }) as unknown as VimeoPlayer;
            v.on('ended', function () {
                v.destroy();
                navigate('/');
            });
            setVPlayer(v);
        }
    }, [contentItem, playerRef, ytSize.width]);

    useImperativeHandle(ref, () => ({
        stop() {
            yPlayer?.stopVideo?.();
            vPlayer?.pause();
        },
    }));

    return (
        <>
            {(contentItem.contentType === 'youtube' || contentItem.contentType === 'vimeo') && (
                <Player width={ytSize.width} height={ytSize.height}>
                    <div id="player" ref={playerRef} />
                </Player>
            )}

            {contentItem.contentType === 'video' && (
                <VideoElement controls autoPlay width={videoSize.width} height={videoSize.height} left={videoSize.left}>
                    <source src={`${CDN}/videos/${contentItem.site}/${contentItem.contentId}`} type="video/mp4" />
                </VideoElement>
            )}
        </>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

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
        if (contentItem?.site === 'fit') return site.leftNav.items.filter((i) => i.category === contentItem?.category ?? '')[0].quote ?? '';
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

            {contentItem?.site !== 'fit' && contentItem?.caption !== undefined && <VideoText ref={titleRef}>{getTile()}</VideoText>}

            {ytScriptLoaded && vmScriptLoaded && contentItem && (
                <VideoPlayer contentItem={contentItem} containerRef={containerRef} titleRef={titleRef} viewsRef={viewsRef} ref={videoPlayerRef} />
            )}

            {(contentItem?.site === 'biz' || contentItem?.site === 'rocks') && contentItem?.views !== undefined && (
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

interface YTProps {
    contentItem: BaseContentItem;
}

export const Youtube: FC<YTProps> = ({ contentItem }) => {
    const [ytScriptLoaded, setYtScriptLoaded] = useState<boolean>(false);
    const videoPlayerRef = useRef<VideoPlayerType>(null);
    const containerRef = useRef<HTMLDivElement>(null);
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

            {ytScriptLoaded && contentItem && <VideoPlayer contentItem={contentItem} ref={videoPlayerRef} containerRef={containerRef} />}
        </PlayerContainer>
    );
};
