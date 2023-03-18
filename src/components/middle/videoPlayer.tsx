import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
    ButtonBar,
    Player,
    PlayerContainer,
    StopButton,
    Video,
    VideoText
} from 'src/components/middle/elements';
import { Size, ContentSize } from 'src/types';
import { useSiteContext } from 'src/providers/sites';
import { useWindowSize } from 'src/utils';
import { CDN } from 'src/constants';

interface Props { }

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

export const VideoPlayer: FC<Props> = () => {
    const { siteMap, selectedSite, selectedContentItem, setSelectedContentItem } = useSiteContext();
    const site = siteMap[selectedSite];

    const [yPlayer, setYPlayer] = useState<YTPlayer>();
    const [vPlayer, setVPlayer] = useState<VimeoPlayer>();

    const [videoSize, setVideoSize] = useState<ContentSize>({ width: 0, height: 0, left: 0, top: 0 });
    const [ytSize, setYtSize] = useState<ContentSize>({ width: 640, height: 480, left: 0, top: 0 });

    const windowSize = useWindowSize();

    const ytPlayer = useMemo<YTPlayer | null>(() => yPlayer ?? null, [yPlayer]);
    const vimeoPlayer = useMemo<VimeoPlayer | null>(() => vPlayer ?? null, [vPlayer]);

    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const viewsRef = useRef<HTMLDivElement>(null);

    const stopVideo = () => {
        ytPlayer?.stopVideo?.();
        vimeoPlayer?.pause();
        setSelectedContentItem(null);
    };

    const getContentSize = (desiredSize: Size): ContentSize => {
        let height: number;
        let width: number;
        const offset = (titleRef.current?.getBoundingClientRect().height ?? 0) + (viewsRef.current?.getBoundingClientRect().height ?? 0);

        const workingWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
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

    const scaleText = () => {
        // if (window.textFit && titleRef.current)
        //     window.textFit(titleRef.current);
    };

    useEffect(() => {
        scaleText();
    }, [windowSize, titleRef, selectedContentItem]);

    useEffect(() => {
        scaleText();
    }, []);

    useEffect(() => {
        window.scroll(0, 0);
        if (selectedContentItem)
            if (selectedContentItem.contentType === 'youtube')
                if (!ytPlayer)
                    // @ts-ignore
                    setYPlayer(new YT.Player('yplayer', {
                        height: ytSize.height,
                        width: ytSize.width,
                        loop: 1,
                        color: 'red',
                        theme: 'light',
                        videoId: selectedContentItem.contentId,
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
                else ytPlayer.loadVideoById(selectedContentItem.contentId);
            else if (selectedContentItem.contentType === 'vimeo')
                if (!vimeoPlayer)
                    // @ts-ignore
                    setVPlayer(new Vimeo.Player('vplayer', {
                        id: selectedContentItem.contentId,
                        width: ytSize.width,
                        autoplay: true,
                        loop: true,
                    }));
                else
                    vimeoPlayer.loadVideo(selectedContentItem.contentId);
    }, [selectedContentItem]);

    useEffect(() => {
        if (selectedContentItem) {
            if (selectedContentItem.contentType === 'video')
                setVideoSize(getContentSize({ width: 1080, height: 1920 }));
            if (selectedContentItem.contentType === 'youtube' || selectedContentItem.contentType === 'vimeo')
                setYtSize(getContentSize({ width: 640, height: 480 }));
        }

    }, [windowSize, selectedContentItem, titleRef]);

    const getTile = () => {
        if (selectedSite === 'biz' || selectedSite === 'rocks')
            return `${selectedContentItem?.caption ?? ''}: ${site.header.name1} ${site.header.name2}`;
        if (selectedSite === 'fit')
            return site.leftNav.items.filter(i => i.category === selectedContentItem?.category ?? '')[0].quote ?? '';
        return selectedContentItem?.name ?? '';
    };

    const videoClass = selectedContentItem?.contentId ? 'loaded' : '';

    return (
        <PlayerContainer className={videoClass} ref={containerRef}>
            { selectedSite !== 'art' && selectedSite !== 'fit' && <VideoText ref={titleRef}>{getTile()}</VideoText> }

            <Player className={selectedContentItem?.contentType !== 'youtube' ? 'hide' : ''} width={ytSize.width} height={ytSize.height}>
                <div id="yplayer" />
            </Player>

            <Player className={selectedContentItem?.contentType !== 'vimeo' ? 'hide' : ''} width={ytSize.width} height={ytSize.height}>
                <div id="vplayer" />
            </Player>

            { selectedContentItem && selectedContentItem.contentType === 'video' && (
                <Video controls autoPlay width={videoSize.width} height={videoSize.height} left={videoSize.left}>
                    <source src={`${CDN}/videos/${selectedSite}/${selectedContentItem?.contentId}`} type="video/mp4" />
                </Video>
            ) }

            { (selectedSite === 'biz' || selectedSite === 'rocks')
                && (<VideoText className="lower" ref={viewsRef}>Views: {selectedContentItem?.views?.toLocaleString('US') ?? ''}</VideoText>)}

            <ButtonBar>
                <StopButton onClick={() => stopVideo()}>BACK</StopButton>
            </ButtonBar>

        </PlayerContainer>
    );
};
