import { createGlobalStyle } from 'styled-components';
import { CDN } from '@/constants';

const Fonts = createGlobalStyle`
    @font-face {
        font-family: BrushScriptStd;
        src: url(${() => `${CDN}/fonts/BrushScriptStd.otf`}) format('opentype');
        font-weight: normal;
        font-style: normal;
    }
    
    @font-face {
        font-family: Pragmatica;
        src: url(${() => `${CDN}/fonts/Pragmatica-ExtraBold.woff`}) format('woff');
        font-weight: bold;
        font-style: normal;
    }
    
    @font-face {
        font-family: Impact;
        src: url(${() => `${CDN}/fonts/impact.woff`}) format('woff');
        font-weight: normal;
        font-style: normal;
    }
`;

export default Fonts;
