import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ButtonBar, ImageContainer, ImageOverlay, Player, PlayerContainer, StopButton, Video, VideoText } from 'src/components/middle/elements';
import { BaseContentItem, Size } from 'src/types';
import { SiteContext } from 'src/providers/site-provider';
import Image from 'next/image';
import { useWindowSize } from 'src/utils';

interface Props {
    contentItem: BaseContentItem | null;
    deselect: () => void;
    className: string;
}

interface YTPlayer {
    stopVideo: () => void;
    playVideo: () => void;
    destroy: () => void;
    loadVideoById: (v: string) => void;
    seekTo: (x: number) => void;
}

interface VimeoPlayer {
    pause: () => void;
    loadVideo: (id: string) => void;
}

export const VideoPlayer: FC<Props> = ({ contentItem, deselect, className }) => {
    const { siteMap, selectedSite } = useContext(SiteContext);
    const site = siteMap[selectedSite];

    const [yPlayer, setYPlayer] = useState<YTPlayer>();
    const [vPlayer, setVPlayer] = useState<VimeoPlayer>();
    const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 });
    const [videoSize, setVideoSize] = useState<Size>({ width: 0, height: 0 });
    const [ytSize, setYtSize] = useState<Size>({ width: 640, height: 480 });
    const windowSize = useWindowSize();

    const ytPlayer = useMemo<YTPlayer | null>(() => yPlayer ?? null, [yPlayer]);
    const vimeoPlayer = useMemo<VimeoPlayer | null>(() => vPlayer ?? null, [vPlayer]);

    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const viewsRef = useRef<HTMLDivElement>(null);

    const stopVideo = () => {
        ytPlayer?.stopVideo?.();
        vimeoPlayer?.pause();
        deselect();
    };

    const getContentSize = (wWise: Size, desiredSize: Size): Size => {
        let height: number;
        let width: number;
        const offset = (titleRef.current?.getBoundingClientRect().height ?? 0) + (viewsRef.current?.getBoundingClientRect().height ?? 0);

        const workingWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
        const workingHeight = wWise.height - (document?.getElementsByTagName('header')[0]?.getBoundingClientRect().height ?? 0) - offset;

        if (workingWidth > workingHeight) {
            height = workingHeight;
            width = (height * desiredSize.width) / desiredSize.height;
        } else {
            width = workingWidth;
            height = (width * desiredSize.height) / desiredSize.width;
        }

        return { width, height };
    };

    useEffect(() => {
        window.scroll(0, 0);
        if (contentItem)
            if (contentItem.contentType === 'youtube')
                if (!ytPlayer)
                    // @ts-ignore
                    setYPlayer(new YT.Player('yplayer', {
                        height: ytSize.height,
                        width: ytSize.width,
                        loop: 1,
                        color: 'red',
                        theme: 'light',
                        videoId: contentItem.contentId,
                        startSeconds: 0,
                        events: {
                            /* eslint-disable @typescript-eslint/no-explicit-any */
                            onReady: (event: any) => {
                                event.target.playVideo();
                            },
                            onStateChange: (event: any) => {
                                // @ts-ignore
                                if (event.data === YT.PlayerState.ENDED)
                                    stopVideo();
                            },
                            /* eslint-disable @typescript-eslint/no-explicit-any */
                        },
                    }));
                else ytPlayer.loadVideoById(contentItem.contentId);
            else if (contentItem.contentType === 'vimeo')
                if (!vimeoPlayer)
                    // @ts-ignore
                    setVPlayer(new Vimeo.Player('vplayer', {
                        id: contentItem.contentId,
                        width: ytSize.width,
                        autoplay: true,
                        loop: true,
                    }));
                else
                    vimeoPlayer.loadVideo(contentItem.contentId);
    }, [contentItem]);

    useEffect(() => {
        if (contentItem) {
            if (contentItem.contentType === 'image' || contentItem.contentType === 'quad')
                setImageSize(getContentSize(windowSize, { width: contentItem.width ?? 0, height: contentItem.height ?? 0 }));
            if (contentItem.contentType === 'video')
                setVideoSize(getContentSize(windowSize, { width: 1080, height: 1920 }));
            if (contentItem.contentType === 'youtube' || contentItem.contentType === 'vimeo')
                setYtSize(getContentSize(windowSize, { width: 640, height: 480 }));
        }

    }, [windowSize, contentItem]);

    return (
        <PlayerContainer className={className} ref={containerRef}>
            <VideoText ref={titleRef}>{`${contentItem?.caption ?? ''}: ${site.header.name1} ${site.header.name2}`}</VideoText>

            <Player className={contentItem?.contentType !== 'youtube' ? 'hide' : ''} width={ytSize.width} height={ytSize.height}>
                <div id="yplayer" />
            </Player>

            <Player className={contentItem?.contentType !== 'vimeo' ? 'hide' : ''} width={ytSize.width} height={ytSize.height}>
                <div id="vplayer" />
            </Player>

            { contentItem && contentItem.contentType === 'video' && (
                <Video controls autoPlay width={videoSize.width} height={videoSize.height}>
                    <source src={`/videos/${selectedSite}/${contentItem?.contentId}`} type="video/mp4" />
                </Video>
            ) }

            { contentItem && (contentItem.contentType === 'image' || contentItem.contentType === 'quad') && (
                <ImageContainer
                    width={imageSize.width}
                    height={imageSize.height}
                >
                    <Image
                        src={`/images/art/${contentItem.contentId}`}
                        alt="ok"
                        width={imageSize.width}
                        height={imageSize.height}
                    />
                    <ImageOverlay
                        width={imageSize.width}
                        height={imageSize.height}
                    >
                        {/* <VideoText>{contentItem?.name}</VideoText> */}

                    </ImageOverlay>
                </ImageContainer>

            )}

            { (selectedSite === 'biz' || selectedSite === 'rocks')
                && (<VideoText ref={viewsRef}>View: {contentItem?.views?.toLocaleString('US') ?? ''}</VideoText>)}

            <ButtonBar>
                {/* <StopButton onClick={() => stopVideo()}> */}
                {/*     <Image src="/images/fullscreen.png" alt="fullscreen" width={32} height={24} /> */}
                {/* </StopButton> */}
                <StopButton onClick={() => stopVideo()}>BACK</StopButton>
            </ButtonBar>

        </PlayerContainer>
    );
};
