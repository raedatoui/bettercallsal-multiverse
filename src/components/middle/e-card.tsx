import React, { FC } from 'react';
import { ButtonBar, EcardContainer, StopButton } from 'src/components/middle/elements';
import Image from "next/legacy/image";
import { useSiteContext } from 'src/providers/sites';

interface Props {}

export const Ecard:FC<Props> = () => {
    const { setSelectedNavItem } = useSiteContext();

    return (
        <EcardContainer>
            <Image
                width={1050}
                height={600}
                layout="responsive"
                src="/images/e-card/front.png"
                alt="front-biz-card"
            />
            <Image
                width={1050}
                height={600}
                layout="responsive"
                src="/images/e-card/back.png"
                alt="front-biz-card"
            />

            <ButtonBar>
                <StopButton onClick={() => setSelectedNavItem(null)}>BACK</StopButton>
            </ButtonBar>
        </EcardContainer>
    );
};
