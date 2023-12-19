import Image from 'next/image';
import Script from 'next/script';
import React, { useContext } from 'react';
import { LeftAdd1, LeftAdd2, LeftContent, LeftNavContainer, LeftNavMenu } from '@/components/left-nav/elements';
import { useSiteContext } from '@/providers/sites';
import { WindowSizeContext } from '@/providers/window-size';
import { LeftNavItem } from '@/types';
import NavButton from './button';

export const ServerLeftNav = () => {
    const { siteMap, selectedSite } = useSiteContext();

    const site = siteMap[selectedSite];

    const { width } = useContext(WindowSizeContext);
    const clonedNavItems = site.leftNav.items;

    return (
        <>
            <Script id="text-fit" src="/scripts/textfit.js" />
            <LeftNavContainer className="off">
                {selectedSite !== 'gallery' && (
                    <>
                        <LeftNavMenu>
                            {clonedNavItems.map((i) => (
                                <NavButton
                                    key={`${i.id}-${i.site}`}
                                    navItem={i}
                                    callBack={(l: LeftNavItem) => l}
                                    width={width}
                                    fullScreen={false}
                                />
                            ))}
                        </LeftNavMenu>
                        <LeftAdd1>
                            <LeftAdd2>
                                <LeftContent>
                                    <Image
                                        src={site.leftNav.image}
                                        alt={site.leftNav.text}
                                        fill
                                        sizes="100vw"
                                        style={{
                                            maxWidth: '100%',
                                        }}
                                    />
                                </LeftContent>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: site.leftNav.text,
                                    }}
                                />
                            </LeftAdd2>
                        </LeftAdd1>
                    </>
                )}
            </LeftNavContainer>
        </>
    );
};
