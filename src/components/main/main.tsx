import React, { FC, useContext, useEffect } from 'react';
import { Main, NavButton, Overlay } from 'src/styles/sharedstyles';
import { Caption, StopButton } from 'src/components/middle/elements';
import { SiteContext } from 'src/providers/site-provider';
import styled from 'styled-components';
import { CDN } from 'src/constants';

interface Props {
    children: JSX.Element[];
}

const SlideItem = styled(NavButton)`
  position: absolute;
  padding: 4px 6px;
  top: 50%;
  &.left {
    left: 5px;
  }
  
  &.right {
    right: 5px;
  }
`;

export const MainContainer: FC<Props> = ({ children }) => {
    const { contentMap, selectedSite, selectedContentItem, setSelectedContentItem } = useContext(SiteContext);

    const handleSlide = (inc: number) => {
        if (selectedContentItem) {
            let idx = contentMap[selectedSite].indexOf(selectedContentItem);
            idx += inc;
            if (idx === contentMap[selectedSite].length)
                idx = 0;
            if (idx === -1)
                idx = contentMap[selectedSite].length - 1;
            setSelectedContentItem(contentMap[selectedSite][idx]);
        }
    };
    const showOverlay = selectedContentItem && selectedSite === 'art';

    useEffect(() => {
        if (showOverlay)
            document.body.style.overflowY = 'hidden';
        else
            document.body.style.overflowY = 'auto';
    }, [showOverlay]);

    return (
        <Main id="main">
            {children}
            { showOverlay && (
                <Overlay>
                    <Caption>{selectedContentItem.name}</Caption>
                    <StopButton onClick={() => setSelectedContentItem(null)}>Close</StopButton>
                    <div className="img-container">
                        <img src={`${CDN}/images/art/${selectedContentItem.contentId}`} alt="ok" />
                    </div>
                    <SlideItem className="left" onClick={() => handleSlide(-1)}>&lt;&lt;</SlideItem>
                    <SlideItem className="right" onClick={() => handleSlide(1)}>&gt;&gt;</SlideItem>
                </Overlay>
            ) }
        </Main>
    );
};
