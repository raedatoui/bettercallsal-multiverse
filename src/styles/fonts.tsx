'use client';

import { createGlobalStyle } from 'styled-components';
import { config } from '@/constants';

const Fonts = createGlobalStyle`
    @font-face {
        font-family: BrushScriptStd;
        src: url(${() => `${config.cdnUrl}/fonts/BrushScriptStd.otf`}) format('opentype');
        font-weight: normal;
        font-style: normal;
    }
    
    @font-face {
        font-family: Pragmatica;
        src: url(${() => `${config.cdnUrl}/fonts/Pragmatica-ExtraBold.woff`}) format('woff');
        font-weight: bold;
        font-style: normal;
    }
    
    @font-face {
        font-family: Impact;
        src: url(${() => `${config.cdnUrl}/fonts/impact.woff`}) format('woff');
        font-weight: normal;
        font-style: normal;
    }
`;

export default Fonts;
