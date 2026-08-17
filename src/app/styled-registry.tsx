'use client';

import isPropValid from '@emotion/is-prop-valid';
import { useServerInsertedHTML } from 'next/navigation';
import React, { FC, useState } from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

// DOC: v5 filtered unknown props off DOM elements automatically. v6 dropped that, so a custom
//  prop like animationDuration on a styled.a leaks into the HTML and React warns. this restores
//  the v5 behaviour in one place rather than renaming every custom prop to the $transient form.
//  target is a string for host elements and a component for composed ones, which must keep
//  receiving everything.
const shouldForwardProp = (propName: string, target: unknown) => (typeof target === 'string' ? isPropValid(propName) : true);

// DOC: replaces the ServerStyleSheet dance the pages router did in _document.tsx. without this
//  the export ships unstyled HTML, which is exactly what the no-JS render depends on.
const StyledRegistry: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sheet] = useState(() => new ServerStyleSheet());

    useServerInsertedHTML(() => {
        const styles = sheet.getStyleElement();
        sheet.instance.clearTag();
        return <>{styles}</>;
    });

    // DOC: the sheet is server-only, but shouldForwardProp has to apply on both sides or the
    //  client re-introduces the leaked attributes on the first render after hydration.
    if (typeof window !== 'undefined') return <StyleSheetManager shouldForwardProp={shouldForwardProp}>{children}</StyleSheetManager>;

    return (
        <StyleSheetManager sheet={sheet.instance} shouldForwardProp={shouldForwardProp}>
            {children}
        </StyleSheetManager>
    );
};

export default StyledRegistry;
