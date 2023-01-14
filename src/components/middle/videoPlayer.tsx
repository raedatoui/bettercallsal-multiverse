import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    ButtonBar,
    ImageContainer,
    Player,
    PlayerContainer,
    Quote,
    StopButton,
    Video,
    VideoText
} from 'src/components/middle/elements';
import { BaseContentItem, Size, ContentSize } from 'src/types';
import { SiteContext } from 'src/providers/site-provider';
import Image from 'next/image';
import { useWindowSize } from 'src/utils';
import styled from 'styled-components';
import { NavButton } from 'src/styles/sharedstyles';
import { CDN } from 'src/constants';

interface Props {
    contentItem: BaseContentItem | null;
    handleImageSlide: (inc: number) => void;
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

const SlideItem = styled(NavButton)`
  position: absolute;
  padding: 4px 6px;
  top: calc(50% - 32px);
  &.left {
    left: 5px;
  }
  
  &.right {
    right: 5px;
  }
`;

export const VideoPlayer: FC<Props> = ({ contentItem, deselect, className, handleImageSlide }) => {
    const { siteMap, selectedSite } = useContext(SiteContext);
    const site = siteMap[selectedSite];

    const [yPlayer, setYPlayer] = useState<YTPlayer>();
    const [vPlayer, setVPlayer] = useState<VimeoPlayer>();
    const [imageSize, setImageSize] = useState<ContentSize>({ width: 0, height: 0, left: 0 });
    const [videoSize, setVideoSize] = useState<ContentSize>({ width: 0, height: 0, left: 0 });
    const [ytSize, setYtSize] = useState<ContentSize>({ width: 640, height: 480, left: 0 });
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

    const getContentSize = (wWise: Size, desiredSize: Size): ContentSize => {
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
        if (width > workingWidth) {
            width = workingWidth;
            height = (width * desiredSize.height) / desiredSize.width;
        }

        return { width, height, left: (workingWidth - width) / 2 };
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

    const getTile = () => {
        if (selectedSite === 'biz' || selectedSite === 'rocks')
            return `${contentItem?.caption ?? ''}: ${site.header.name1} ${site.header.name2}`;
        return contentItem?.name ?? '';
    };

    return (
        <PlayerContainer className={className} ref={containerRef}>
            <VideoText ref={titleRef}>{getTile()}</VideoText>
            { contentItem && contentItem.contentType === 'video'
                && (<Quote ref={viewsRef}>{site.leftNav.items.filter(i => i.category === contentItem.category)[0].quote ?? ''}</Quote>)}
            <Player className={contentItem?.contentType !== 'youtube' ? 'hide' : ''} width={ytSize.width} height={ytSize.height}>
                <div id="yplayer" />
            </Player>

            <Player className={contentItem?.contentType !== 'vimeo' ? 'hide' : ''} width={ytSize.width} height={ytSize.height}>
                <div id="vplayer" />
            </Player>

            { contentItem && contentItem.contentType === 'video' && (
                <Video controls autoPlay width={videoSize.width} height={videoSize.height} left={videoSize.left}>
                    <source src={`${CDN}/videos/${selectedSite}/${contentItem?.contentId}`} type="video/mp4" />
                </Video>
            ) }

            { contentItem && (contentItem.contentType === 'image' || contentItem.contentType === 'quad') && (
                <ImageContainer
                    height={imageSize.height}
                    left={imageSize.left}
                >
                    <Image
                        src={`/images/art/${contentItem.contentId}`}
                        alt="ok"
                        width={imageSize.width}
                        height={imageSize.height}
                    />
                    <SlideItem className="left" onClick={() => handleImageSlide(-1)}>&lt;&lt;</SlideItem>
                    <SlideItem className="right" onClick={() => handleImageSlide(1)}>&gt;&gt;</SlideItem>
                    {/* <ImageOverlay */}
                    {/*     width={imageSize.width} */}
                    {/*     height={imageSize.height} */}
                    {/* /> */}
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
