import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Player, PlayerContainer, StopButton, VideoText } from 'src/components/middle/elements';
import { BizContentItem } from 'src/types';
import { SiteContext } from 'src/providers/site-provider';

interface Props {
    contentItem: BizContentItem | null;
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

    const ytPlayer = useMemo<YTPlayer | null>(() => yPlayer ?? null, [yPlayer]);
    const vimeoPlayer = useMemo<VimeoPlayer | null>(() => vPlayer ?? null, [vPlayer]);

    const stopVideo = () => {
        ytPlayer?.stopVideo();
        ytPlayer?.stopVideo();
        vimeoPlayer?.pause();
        deselect();
    };

    useEffect(() => {
        window.scroll(0, 0);
        if (contentItem)
            if (contentItem.contentType === 'youtube')
                if (!ytPlayer)
                    // @ts-ignore
                    setYPlayer(new YT.Player('yplayer', {
                        height: 480,
                        width: 640,
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
                        // width: 640,
                        autoplay: true,
                        loop: true,
                    }));
                else
                    vimeoPlayer.loadVideo(contentItem.contentId);
    }, [contentItem?.contentType]);

    return (
        <PlayerContainer className={className}>
            <VideoText>{`${contentItem?.caption ?? ''}: ${site.header.name1} ${site.header.name2}`}</VideoText>
            <Player className={contentItem?.contentType === 'vimeo' ? 'hide' : ''}>
                <div id="yplayer" />
            </Player>
            <Player className={contentItem?.contentType === 'youtube' ? 'hide' : ''}>
                <div id="vplayer" />
            </Player>
            <StopButton onClick={() => stopVideo()}>STOP</StopButton>
            <VideoText>View: {contentItem?.views.toLocaleString('US') ?? ''}</VideoText>
        </PlayerContainer>
    );
};
