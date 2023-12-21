import Link from 'next/link';
import React, { FC, useEffect, useRef } from 'react';
import { LeftNavButton, LeftNavItemCuck } from '@/components/left-nav/elements';
import { LeftNavItem } from '@/types';

interface ButtonProps {
    navItem: LeftNavItem;
    callBack: (c: LeftNavItem) => void;
    width: number;
    fullScreen: boolean;
}

const NavButton: FC<ButtonProps> = ({ navItem, callBack, width, fullScreen }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.textFit && ref.current && !fullScreen)
            window.textFit(ref.current, {
                alignVert: true,
                alignHoriz: false,
                detectMultiLine: false,
                widthOnly: false,
                maxFontSize: 34,
            });
    }, [width, ref, fullScreen]);

    useEffect(() => {
        if (window.textFit && ref.current && !fullScreen)
            window.textFit(ref.current, {
                alignVert: true,
                alignHoriz: false,
                detectMultiLine: false,
                widthOnly: false,
                maxFontSize: 34,
            });
    });

    const handleClick = () => {
        callBack(navItem);
    };

    return (
        <LeftNavButton onClick={handleClick}>
            {!navItem.link && (
                <LeftNavItemCuck
                    ref={ref}
                    dangerouslySetInnerHTML={{
                        __html: navItem.name,
                    }}
                />
            )}
            {navItem.link && (
                <LeftNavItemCuck ref={ref}>
                    <Link
                        href={navItem.link}
                        target="_blank"
                        rel="noreferrer"
                        dangerouslySetInnerHTML={{
                            __html: navItem.name,
                        }}
                    />
                </LeftNavItemCuck>
            )}
        </LeftNavButton>
    );
};

export default NavButton;
