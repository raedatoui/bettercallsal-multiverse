import { createGlobalStyle } from 'styled-components';

const Fonts = createGlobalStyle`
    @font-face {
        font-family: BrushScriptStd;
        src: url('https://storage.googleapis.com/bcs-assets/fonts/BrushScriptStd.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
    }
    
    @font-face {
        font-family: Pragmatica;
        src: url('https://storage.googleapis.com/bcs-assets/fonts/Pragmatica-ExtraBold.woff') format('woff');
        font-weight: bold;
        font-style: normal;
    }
    
    @font-face {
        font-family: Impact;
        src: url('https://storage.googleapis.com/bcs-assets/fonts/impact.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }
`;

export default Fonts;
