import React, { FC, useContext } from 'react';
import { Main, Overlay } from 'src/styles/sharedstyles';
import { StopButton } from 'src/components/middle/elements';
import { SiteContext } from 'src/providers/site-provider';
import { LeftNavButton } from 'src/components/leftNav/elements';

interface Props {
    children: JSX.Element;
}

export const MainContainer: FC<Props> = ({ children }) => {
    const { selectedSite, contentMap, selectedContentItem, setSelectedContentItem } = useContext(SiteContext);
    if (selectedContentItem)
        console.log(contentMap[selectedSite].indexOf(selectedContentItem));

    return (
        <Main id="main">
            {children}
            { selectedContentItem && selectedSite === 'art' && (
                <Overlay>
                    <StopButton onClick={() => setSelectedContentItem(null)}>Close</StopButton>
                    <LeftNavButton>prev</LeftNavButton>
                    <img src={`images/art/${selectedContentItem.contentId}`} alt="ok" />
                    <LeftNavButton>next</LeftNavButton>
                </Overlay>
            ) }
        </Main>
    );
};
