import Image from 'next/image';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteContext } from '@/providers/sites';
import { ButtonBar, Caption, EcardContainer, StopButton } from '@/styles/sharedstyles';

interface Props {}

const Ecard:FC<Props> = () => {
    const navigate = useNavigate();
    const {
        siteMap,
        selectedSite,
        bizerkMode,
    } = useSiteContext();
    const site = siteMap[selectedSite];
    return (
        <>
            <Caption
                className={bizerkMode !== 'off' ? 'bizerk' : ''}
            >{site.contentHeader}
            </Caption>
            <EcardContainer>
                <Image
                    width={1050}
                    height={600}
                    src="/images/e-card/front.png"
                    alt="front-biz-card"
                    sizes="100vw"
                    style={{
                        height: 'auto'
                    }}
                />
                <Image
                    width={1050}
                    height={600}
                    src="/images/e-card/back.png"
                    alt="front-biz-card"
                    sizes="100vw"
                    style={{
                        height: 'auto'
                    }}
                />

                <ButtonBar>
                    <StopButton onClick={() => navigate('/')}>[x]</StopButton>
                </ButtonBar>
            </EcardContainer>
        </>
    );
};

export default Ecard;
