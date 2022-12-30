import React, { FC, useContext } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import {
    Caption, ContentItem, ContentItemTitle, ContentList, MiddleSection, Quote
} from 'src/components/middle/elements';


interface Props { }

export const Middle: FC<Props> = () => {
    const { siteMap, selectedSite, contentMap, loading } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    const contentList = contentMap[selectedSite];

    return (
        <MiddleSection>
            <Caption>{site.contentHeader}</Caption>
            <Quote />
            <ContentList>
                { loading && <div>loading</div> }
                { !loading && contentList.map(i => (
                    <ContentItem key={i.contentId}>
                        <img alt={i.name} src={`/images/${selectedSite}/thumbs/${i.thumb}`} />
                        <ContentItemTitle>
                            { i.name }
                        </ContentItemTitle>
                    </ContentItem>
                ))}
            </ContentList>
        </MiddleSection>
    );
};
