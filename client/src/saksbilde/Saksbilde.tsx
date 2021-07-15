import styled from 'styled-components/macro'
import { Personinfo } from '../types/types.internal'
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary'
//import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel'
//import '@navikt/helse-frontend-logg/lib/main.css';

//import { ErrorBoundary } from '../../components/ErrorBoundary';
import { LasterPersonlinje, Personlinje } from './Personlinje';
import { useSak } from './sakHook';
import { FeilmeldingVarsel } from '../feilsider/FeilmeldingsVarsel';
//import { copyString } from '../../components/clipboard/util';
//import { ToastObject, useAddToast } from '../../state/toasts';

//import { Sakslinje } from './sakslinje/Sakslinje';

const SaksbildeContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: max-content;
`;

/*const kopiertFødelsnummerToast = ({
    message = 'Fødselsnummer er kopiert',
    timeToLiveMs = 3000,
}: Partial<ToastObject>): ToastObject => ({
    key: 'kopierFødselsnummerToastKey',
    message,
    timeToLiveMs,
});*/



const SaksbildeContent = React.memo(() => {
    //const personTilBehandling = usePerson();
    //const aktivPeriode = useAktivPeriode();

    //useRefreshPersonVedUrlEndring();

    const { sak, isError, isLoading } = useSak()

    if (isLoading) return <LasterSaksbilde />;

    if(isError) throw new Error("Feil med henting av sak" + isError)



    return (
        <SaksbildeContainer className="saksbilde">
            <Personlinje person={sak.personinformasjon} />
            <div>
                {sak.saksid}
            </div>
            {/*<Sakslinje aktivPeriode={aktivPeriode} />*/}
        </SaksbildeContainer>
    );
});

const LasterSaksbilde = () => (
    <SaksbildeContainer className="saksbilde" data-testid="laster-saksbilde">
        <LasterPersonlinje />
    </SaksbildeContainer>
)

export const Saksbilde = () => (
    <ErrorBoundary FallbackComponent={FeilmeldingVarsel}>
        <React.Suspense fallback={<LasterSaksbilde />}>
            <SaksbildeContent />
        </React.Suspense>
        </ErrorBoundary>
);

export default Saksbilde;
