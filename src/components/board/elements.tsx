'use client';

import styled from 'styled-components';

export const AudioBoard = styled.div`
    width: 100%;
    height: 100%;
    transform: rotateY(-540deg);
    display: grid;
    background-image: linear-gradient(#fd9f00, #fbfa00);
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
`;