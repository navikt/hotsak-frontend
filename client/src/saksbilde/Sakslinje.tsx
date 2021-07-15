import styled from 'styled-components/macro'
import React from 'react';

import { Flex } from '../felleskomponenter/Flex';
//import { Location, useNavigation } from '../../../hooks/useNavigation';
//import { Periodetype, Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';

//import { TabLink } from '../TabLink';
//import { HistorikkHeader } from '../historikk/HistorikkHeader';
//import { Sakslinjemeny, VerktøylinjeForTomtSaksbilde } from './Sakslinjemeny';
//import { HjemIkon } from './icons/HjemIkon';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    height: 48px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--navds-color-border);
    padding: 0 2rem 0 2rem;
    min-width: var(--speil-total-min-width);

    > div:last-of-type {
        margin-left: 1rem;
    }
`;

const TabList = styled.span`
    display: flex;
`;

interface SakslinjeProps {
    //aktivPeriode: Tidslinjeperiode;
}

export const Sakslinje = (/*{ aktivPeriode }: SakslinjeProps*/) => {
    //const { pathForLocation } = useNavigation();

    return (
        <Container>
            <Flex>
                {/*(aktivPeriode?.type === Periodetype.VEDTAKSPERIODE ||
                    aktivPeriode?.type === Periodetype.REVURDERING) && (
                    <TabList role="tablist">
                        <TabLink to={pathForLocation(Location.Utbetaling)} title="Utbetaling" icon={<HjemIkon />}>
                            Utbetaling
                        </TabLink>
                        <TabLink to={pathForLocation(Location.Vilkår)} title="Vilkår">
                            Vilkår
                        </TabLink>
                        <TabLink to={pathForLocation(Location.Sykepengegrunnlag)} title="Sykepengegrunnlag">
                            Sykepengegrunnlag
                        </TabLink>
                        <TabLink to={pathForLocation(Location.Faresignaler)} title="Faresignaler">
                            Faresignaler
                        </TabLink>
                    </TabList>
                )}
                    <Sakslinjemeny aktivPeriode={aktivPeriode} />*/}
            </Flex>
            {/*<HistorikkHeader />*/}
        </Container>
    );
};

export const SakslinjeForTomtSaksbilde = () => (
    <Container>
        {/*<VerktøylinjeForTomtSaksbilde />*/}
    </Container>
);
