import React from 'react'

import { KnappBaseProps } from 'nav-frontend-knapper'

//import { useFjernPåVent } from '../../../../../state/oppgaver';
//import { useOperationErrorHandler } from '../../../../../state/varsler';

//import { AsyncMenuButton } from './AsyncMenuButton';

interface FjernFraPåVentMenuButtonProps extends KnappBaseProps {
  oppgavereferanse: string
}

export const FjernFraPåVentMenuButton = ({ oppgavereferanse }: FjernFraPåVentMenuButtonProps) => {
  // const fjernPåVent = useFjernPåVent();
  //const errorHandler = useOperationErrorHandler('Legg på vent');

  return <div>AsyncMenyButton</div>
  /*return (
        "AsyncMenuButton")
        {/*<AsyncMenuButton asyncOperation={() => fjernPåVent({ oppgavereferanse })} onFail={errorHandler}>
            Fjern fra på vent
    </AsyncMenuButton>*/
}
