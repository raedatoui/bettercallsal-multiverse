'use client';

import { useServerInsertedHTML } from 'next/navigation';
import React, { FC, useState } from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

// DOC: replaces the ServerStyleSheet dance the pages router did in _document.tsx. without this
//  the export ships unstyled HTML, which is exactly what the no-JS render depends on.
const StyledRegistry: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sheet] = useState(() => new ServerStyleSheet());

    useServerInsertedHTML(() => {
        const styles = sheet.getStyleElement();
        sheet.instance.clearTag();
        return <>{styles}</>;
    });

    if (typeof window !== 'undefined') return <>{children}</>;

    return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
};

export default StyledRegistry;
