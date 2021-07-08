import React from 'react'

import { KnappBaseProps } from 'nav-frontend-knapper'

import { Saksbehandler, TildelingType } from '../../../types/types.internal'
//import { useTildelOppgave } from '../../../../../state/oppgaver';
import { AsyncMenuButton } from './AsyncMenuButton'

interface TildelMenuButtonProps extends KnappBaseProps {
  oppgavereferanse: string
  saksbehandler: Saksbehandler
  tildeling?: TildelingType
}

export const TildelMenuButton = ({ oppgavereferanse, saksbehandler, tildeling, ...rest }: TildelMenuButtonProps) => {
  //const tildelOppgave = useTildelOppgave();
  return <div>Tildel meg button</div>
  /*return (
        <AsyncMenuButton
            asyncOperation={() => tildelOppgave({ oppgavereferanse }, saksbehandler)}
            disabled={tildeling !== undefined}
            {...rest}
        >
            Tildel meg
        </AsyncMenuButton>
    );*/
}
