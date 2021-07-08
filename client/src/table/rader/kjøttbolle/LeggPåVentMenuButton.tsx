import React from 'react'

import { KnappBaseProps } from 'nav-frontend-knapper'

//import { useLeggPåVent } from '../../../../../state/oppgaver';
//import { useOperationErrorHandler } from '../../../../../state/varsler';
import { AsyncMenuButton } from './AsyncMenuButton'

interface LeggPåVentMenuButtonProps extends KnappBaseProps {
  oppgavereferanse: string
}

export const LeggPåVentMenuButton = ({ oppgavereferanse, ...rest }: LeggPåVentMenuButtonProps) => {
  //  const leggPåVent = useLeggPåVent();
  //const errorHandler = useOperationErrorHandler('Legg på vent');

  return <div>Legg på vent button</div>

  /*return (
        <AsyncMenuButton asyncOperation={() => leggPåVent({ oppgavereferanse })} onFail={errorHandler} {...rest}>
            Legg på vent
        </AsyncMenuButton>
    );*/
}
