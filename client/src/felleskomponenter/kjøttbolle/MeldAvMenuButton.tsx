/* eslint-disable no-lone-blocks */

//import { useFjernTildeling } from '../../../../../state/oppgaver';
//import { AsyncMenuButton } from './AsyncMenuButton'

interface MeldAvMenuButtonProps  {
  oppgavereferanse: string
}

export const MeldAvMenuButton = ({ oppgavereferanse, ...rest }: MeldAvMenuButtonProps) => {
  //const fjernTildeling = useFjernTildeling();
  return (<></>
  )
    // eslint-disable-next-line no-lone-blocks
    // eslint-disable-next-line no-unreachable
    {/*<AsyncMenuButton
      asyncOperation={() => {
        fjernTildeling({ oppgavereferanse }) console.log('Her kommer funksjon for å fjerne tildeling etterhvert')
        return Promise.resolve()
      }}
      {...rest}
    >
      Meld av
    </AsyncMenuButton>*/}
}
