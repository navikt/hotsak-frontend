import { InformationSquareIcon } from '@navikt/aksel-icons'
import { ActionMenu, InternalHeader } from '@navikt/ds-react'
import { useRef } from 'react'

import classes from './EndringsloggMenu.module.css'

import { Endringslogg } from './Endringslogg'
import { useEndringslogg } from './useEndringslogg'

export function EndringsloggMenu() {
  const endringslogg = useEndringslogg()
  const contentRef = useRef<HTMLDivElement>(null)
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <InternalHeader.Button style={{ position: 'relative' }}>
          {!endringslogg.isLoading && (
            <div className={`${classes.uleste} ${endringslogg.fading ? classes.fading : ''}`} />
          )}
          <InformationSquareIcon title="Endringslogg" width={20} height={20} />
        </InternalHeader.Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content ref={contentRef} tabIndex={0}>
        <Endringslogg endringslogginnslag={endringslogg.innslag} merkSomLest={endringslogg.merkSomLest} />
      </ActionMenu.Content>
    </ActionMenu>
  )
}
