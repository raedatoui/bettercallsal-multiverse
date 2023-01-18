import React, { FC } from 'react';
import { FooterContainer } from 'src/components/footer/elements';

interface Props {}

export const Footer: FC<Props> = () => (
    <FooterContainer>
        <h2><a href="tel:+19173229246">• NOT TOLL FREE (917) 322-9246 •</a></h2>
    </FooterContainer>
);
