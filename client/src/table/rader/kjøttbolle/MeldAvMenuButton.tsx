import { KnappBaseProps } from 'nav-frontend-knapper'

//import { useFjernTildeling } from '../../../../../state/oppgaver';
import { AsyncMenuButton } from './AsyncMenuButton'

interface MeldAvMenuButtonProps extends KnappBaseProps {
  oppgavereferanse: string
}

export const MeldAvMenuButton = ({ oppgavereferanse, ...rest }: MeldAvMenuButtonProps) => {
  //const fjernTildeling = useFjernTildeling();
  return (
    <AsyncMenuButton
      asyncOperation={() => {
        /*fjernTildeling({ oppgavereferanse })*/ console.log('Her kommer funksjon for å fjerne tildeling etterhvert')
        return Promise.resolve()
      }}
      {...rest}
    >
      Meld av
    </AsyncMenuButton>
  )
}
