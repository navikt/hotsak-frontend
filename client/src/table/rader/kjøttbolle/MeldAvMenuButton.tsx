import React from 'react'

import { KnappBaseProps } from 'nav-frontend-knapper'

//import { useFjernTildeling } from '../../../../../state/oppgaver';
import { AsyncMenuButton } from './AsyncMenuButton'

interface MeldAvMenuButtonProps extends KnappBaseProps {
  oppgavereferanse: string
}

export const MeldAvMenuButton = ({ oppgavereferanse, ...rest }: MeldAvMenuButtonProps) => {
  //const fjernTildeling = useFjernTildeling();
  return <div>Meld av button</div>
  /*return (
        <AsyncMenuButton asyncOperation={() => fjernTildeling({ oppgavereferanse })} {...rest}>
            Meld av
        </AsyncMenuButton>
    );*/
}
