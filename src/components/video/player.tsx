import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CDN } from '@/constants';
import { Player, VideoElement } from '@/styles/sharedstyles';
import { BaseContentItem, ContentSize, Size, VimeoPlayer, YTPlayer } from '@/types';
import { useWindowSize } from '@/utils';

interface Props {
    contentItem: BaseContentItem;
    containerRef?: React.RefObject<HTMLDivElement>;
    titleRef?: React.RefObject<HTMLDivElement>;
    viewsRef?: React.RefObject<HTMLDivElement>;
    autoPlay: boolean;
}

export interface VideoPlayerType {
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

export const VideoPlayer = forwardRef<VideoPlayerType, Props>(({ autoPlay, contentItem, containerRef, viewsRef, titleRef }, ref) => {
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
    const [currentContentId, setCurrentContentId] = useState<string>('');

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
        console.log(currentContentId, contentItem.contentId);
        if (contentItem.contentType === 'youtube' && currentContentId !== contentItem.contentId) {
            // DOC: if not, then we risk calling loadVideoById on the same videoId, which will cause the video to restart.
            setCurrentContentId(contentItem.contentId);
            // kill vimeo player if playing youtube from left nav.
            // the day we have vimeo or others in the left nav, we will need to stop the youtube player.
            if (vPlayer) vPlayer.pause();
            if (yPlayer && contentItem.contentId) {
                if (autoPlay) yPlayer.loadVideoById(contentItem.contentId);
                else yPlayer.cueVideoById(contentItem.contentId);
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
                    events: {
                        onReady: (event: Record<string, unknown>) => {
                            const player = event.target as YTPlayer;
                            setYPlayer(player);
                            if (autoPlay) player.playVideo();
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
