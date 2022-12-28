import React, { FC, useContext } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import {Caption, ContentList, MiddleSection, Quote} from 'src/components/middle/elements';

interface Props { }

export const Middle: FC<Props> = () => {
    const { sites, selectedSite } = useContext(SiteContext);
    const site = sites[selectedSite];

    return (
        <MiddleSection>
            <Caption>{site.contentHeader}</Caption>
            <Quote>allhairharjos.com</Quote>
            <ContentList>

            </ContentList>
        </MiddleSection>
    );
};
