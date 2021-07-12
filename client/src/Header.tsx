import styled from '@emotion/styled'
//import { Person } from 'internal-types';
import { Link/*, useHistory*/ } from 'react-router-dom'

//import { useRecoilValue } from 'recoil';
//import '@navikt/ds-css'
//import { InternalHeader, InternalHeaderTitle } from '@navikt/ds-react'
import { HeaderEnkel } from '@navikt/helse-frontend-header'
import '@navikt/helse-frontend-header/lib/main.css'
//import { Varseltype } from '@navikt/helse-frontend-varsel'

//import { authState } from '../state/authentication';
//import { useAddVarsel, useRemoveVarsel } from '../state/varsler';

//import { BentoMeny } from './BentoMeny';
//import Brukermeny from './Brukermeny';

const Container = styled.div`
  flex-shrink: 0;
  width: 100%;

  > header {
    max-width: unset;
    box-sizing: border-box;
  }

  input {
    margin-left: 1.5rem;
  }

  .navds-header__title > span > a:focus {
    box-shadow: none;
  }

  .navds-header__title > span > a:focus-visible {
    box-shadow: var(--navds-shadow-focus-on-dark);
    outline: none;
  }
`

export const HeaderBar = () => {
  //const history = useHistory()
  //const hentPerson = useHentPerson();
  //const removeVarsel = useRemoveVarsel();
  //const addVarsel = useAddVarsel();

  //const { name, ident, isLoggedIn } = useRecoilValue(authState);

  //const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

  return (
    <Container>
      <HeaderEnkel
        tittel={<Link to="/">NAV Hjelpemidler</Link>}
        brukerinfo={{ navn: 'Navn Navnesen', ident: '' /*, enhet: 'Enhetsnavn', rolle: 'Saksbehandler'*/ }}
      >
        {/*<BentoMeny />*/}
      </HeaderEnkel>

      {/*<InternalHeader>
                <InternalHeaderTitle>
                    
                </InternalHeaderTitle>
                <BentoMeny />
                <Brukermeny navn={brukerinfo.navn} ident={brukerinfo.ident} />
            </InternalHeader>*/}
    </Container>
  )
}
