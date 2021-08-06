import styled from '@emotion/styled';
import React from 'react';

import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 3em);

    p {
        font-size: 1.5rem;
        padding: 0.5rem;
    }
`;

export const IkkeLoggetInn = () => (
    <Container>
        <Normaltekst>Du må logge inn for å få tilgang til systemet</Normaltekst>
        <Normaltekst>
            <Lenke href="/">Gå til innloggingssiden</Lenke>
        </Normaltekst>
    </Container>
);
