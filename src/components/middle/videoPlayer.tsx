'use client';

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
    ButtonBar,
    MiddleSection,
    Player,
    PlayerContainer,
    StopButton,
    Video,
    VideoText
} from 'src/components/middle/elements';
import { Size, ContentSize, BaseContentItem, GameContentItem } from 'src/types';
import { useSiteContext } from 'src/providers/sites';
import { slugify, useWindowSize } from '@/utils';
import { CDN } from 'src/constants';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

interface Props {
    contentItem: BaseContentItem;
}

interface YTPlayer {
    stopVideo: () => void;
    playVideo: () => void;
    destroy: () => void;
    loadVideoById: (v: string) => void;
    cueVideoById: (v: string) => void;
    seekTo: (x: number) => void;
}

interface VimeoPlayer {
    pause: () => void;
    loadVideo: (id: string) => void;
}

const getContentSize = (desiredSize: Size, containerRef: HTMLDivElement, titleRef: HTMLDivElement, viewsRef: HTMLDivElement): ContentSize => {
    let height: number;
    let width: number;
    const offset = (titleRef.getBoundingClientRect().height ?? 0) + (viewsRef.getBoundingClientRect().height ?? 0);

    const workingWidth = containerRef.getBoundingClientRect().width ?? 0;
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
    return { width, height, left: (workingWidth - width) / 2, top: (workingHeight - height) / 2 };
};

const findVideo = (list: (BaseContentItem | GameContentItem)[], videoId: string) =>
    list.filter(i => slugify(i.name) === videoId)[0];

const VideoPlayer: FC<Props> = ({ contentItem }) => {
    const router = useRouter();
    const { siteMap, selectedSite, setFullScreen } = useSiteContext();
    const site = siteMap[selectedSite];

    const [yPlayer, setYPlayer] = useState<YTPlayer>();
    const [vPlayer, setVPlayer] = useState<VimeoPlayer>();

    const [videoSize, setVideoSize] = useState<ContentSize>({ width: 0, height: 0, left: 0, top: 0 });
    const [ytSize, setYtSize] = useState<ContentSize>({ width: 640, height: 480, left: 0, top: 0 });

    const windowSize = useWindowSize();

    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const viewsRef = useRef<HTMLDivElement>(null);
    const vPlayerRef = useRef<HTMLDivElement>(null);
    const yPlayerRef = useRef<HTMLDivElement>(null);

    const stopVideo = useCallback(() => {
        yPlayer?.stopVideo?.();
        vPlayer?.pause();
        setFullScreen(false);
        router.push('/');
    }, [router, vPlayer, yPlayer]);

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

    const getTile = () => {
        if (selectedSite === 'biz' || selectedSite === 'rocks')
            return `${contentItem?.caption ?? ''}: ${site.header.name1} ${site.header.name2}`;
        if (selectedSite === 'fit')
            return site.leftNav.items.filter(i => i.category === contentItem?.category ?? '')[0].quote ?? '';
        return contentItem?.name ?? '';
    };

    const videoClass = contentItem?.contentId ? 'loaded' : '';

    useEffect(() => {
        if (containerRef.current && titleRef.current && viewsRef.current) {
            if (contentItem.contentType === 'video')
                setVideoSize(getContentSize({ width: 1080, height: 1920 }, containerRef.current, titleRef.current, viewsRef.current));
            if (contentItem.contentType === 'youtube' || contentItem.contentType === 'vimeo')
                setYtSize(getContentSize({ width: 640, height: 480 }, containerRef.current, titleRef.current, viewsRef.current));
        }
        return () => {};
    }, [windowSize]);

    useEffect(() => {
        // @ts-ignore
        if (contentItem.contentType === 'youtube' && YT.Player && yPlayerRef.current)
            // // kill vimeo player if playing from left nav
            // if (vPlayer)
            //     vPlayer.pause();
            // @ts-ignore
            // eslint-disable-next-line no-new
            new YT.Player('yplayer', {
                height: ytSize.height,
                width: ytSize.width,
                loop: 1,
                color: 'red',
                theme: 'light',
                videoId: contentItem.contentId,
                enablejsapi: 1,
                startSeconds: 0,
                events: {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    onReady: (event: any) => {
                        setYPlayer(event.target);
                        event.target.playVideo();
                    },
                    onStateChange: (event: any) => {
                        // @ts-ignore
                        if (event.data === YT.PlayerState.ENDED)
                            stopVideo();
                    },
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                },
            });
    }, [contentItem, yPlayerRef]);

    useEffect(() => {
        if (contentItem.contentType === 'vimeo' && vPlayerRef.current)
            // @ts-ignore
            setVPlayer(new Vimeo.Player('vplayer', {
                id: contentItem.contentId,
                width: ytSize.width,
                autoplay: true,
                loop: true,
            }));
    }, [contentItem, vPlayerRef]);

    return (
        <PlayerContainer className={videoClass} ref={containerRef}>
            { selectedSite !== 'art' && selectedSite !== 'fit' && contentItem?.caption !== undefined
                && <VideoText ref={titleRef}>{getTile()}</VideoText> }

            <Player className={contentItem?.contentType !== 'youtube' ? 'hide' : ''} width={ytSize.width} height={ytSize.height}>
                <div id="yplayer" ref={yPlayerRef} />
            </Player>

            <Player className={contentItem?.contentType !== 'vimeo' ? 'hide' : ''} width={ytSize.width} height={ytSize.height}>
                <div id="vplayer" ref={vPlayerRef} />
            </Player>

            { contentItem && contentItem.contentType === 'video' && (
                <Video controls autoPlay width={videoSize.width} height={videoSize.height} left={videoSize.left}>
                    <source src={`${CDN}/videos/${selectedSite}/${contentItem?.contentId}`} type="video/mp4" />
                </Video>
            ) }

            { (selectedSite === 'biz' || selectedSite === 'rocks') && contentItem?.views !== undefined
                && (<VideoText className="lower" ref={viewsRef}>Views: {contentItem?.views?.toLocaleString('US') ?? ''}</VideoText>)}

            <ButtonBar>
                <StopButton onClick={() => stopVideo()}>BACK</StopButton>
            </ButtonBar>

        </PlayerContainer>
    );
};

interface VideoWrapperProps {
    videoId: string;
}
export const VideoWrapper:FC<VideoWrapperProps> = ({ videoId }) => {
    const [ytScriptLoaded, setYtScriptLoaded] = useState<boolean>(false);
    const [vmScriptLoaded, setVmScriptLoaded] = useState<boolean>(false);
    const {
        contentMap,
        selectedSite,
        siteMap,
        setFullScreen,
    } = useSiteContext();
    const site = siteMap[selectedSite];
    const contentList = contentMap[selectedSite];
    const contentItem = findVideo(contentList, videoId);

    useEffect(() => {
        window.scroll(0, 0);
        document.body.scrollTo(0, 0);
        document.getElementById('content-row')?.scrollTo(0, 0);
        if (document.body.clientWidth < 768)
            setFullScreen(true);
    }, [contentItem, selectedSite, setFullScreen, site.leftNav.items]);

    useEffect(() => {
        window.onYouTubeIframeAPIReady = () => {
            setYtScriptLoaded(true);
        };
    }, []);

    return (
        <MiddleSection>
            <Script
                id="youtube-iframe"
                src="https://www.youtube.com/iframe_api"
                onReady={() => {
                    // @ts-ignore
                    if (window.YT.Player)
                        setYtScriptLoaded(true);
                }}
            />
            <Script
                id="vimeo-player"
                src="https://player.vimeo.com/api/player.js"
                onReady={() => setVmScriptLoaded(true)}
            />
            { ytScriptLoaded && vmScriptLoaded && <VideoPlayer contentItem={contentItem} /> }
            { (!ytScriptLoaded || !vmScriptLoaded) && <p>Loading ...</p> }
        </MiddleSection>
    );
};
