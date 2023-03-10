import styled from 'styled-components'

import { headerHøydeRem, hotsakRegistrerSøknadHøyreKolonne, hotsakRegistrerSøknadKolonne } from '../GlobalStyles'

export const Kolonner = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  align-self: flex-end;
  align-items: flex-end;
`

export const TreKolonner = styled.div`
  display: grid;
  /*grid-template-columns: ${hotsakRegistrerSøknadKolonne} auto ${hotsakRegistrerSøknadHøyreKolonne};*/
  grid-template-columns: ${hotsakRegistrerSøknadKolonne} auto;
  grid-template-rows: 1fr;
  height: calc(100vh - ${headerHøydeRem}rem);
`

export const ToKolonner = styled.div`
  display: grid;
  grid-template-columns: ${hotsakRegistrerSøknadKolonne} auto;
  grid-template-rows: 1fr;
  height: calc(100vh - ${headerHøydeRem}rem);
`
