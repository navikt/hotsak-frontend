import { Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { useState } from 'react'

import classes from './AvvisBestillingModalV2.module.css'

import { Tekst } from '../../../felleskomponenter/typografi'
import type { AvvisBestilling } from '../../../types/types.internal'
import { useSakActions } from '../../../saksbilde/useSakActions'
import { BekreftelsesDialog } from '../../../saksbilde/komponenter/BekreftelsesDialog'
import { useBehandling } from '../behandling/useBehandling'

export interface AvvisBestillingModalV2Props {
  open: boolean
  onClose(): void
}

export function AvvisBestillingModalV2({ open, onClose }: AvvisBestillingModalV2Props) {
  const [valgtÅrsak, setValgtÅrsak] = useState<string>('')
  const [begrunnelse, setBegrunnelse] = useState<string>('')
  const [error, setError] = useState('')
  const { avvisBestilling, state } = useSakActions()
  const { mutate: mutateBehandling } = useBehandling()

  async function handleBekreft() {
    if (valgtÅrsak !== '') {
      const tilbakemelding: AvvisBestilling = { valgtArsak: valgtÅrsak, begrunnelse }
      await avvisBestilling(tilbakemelding)
      await mutateBehandling()
      onClose()
    } else {
      setError('Du må velge en årsak i listen over.')
    }
  }

  return (
    <BekreftelsesDialog
      heading="Vil du avvise bestillingen?"
      open={open}
      loading={state.loading}
      bekreftButtonLabel="Avvis bestillingen"
      onBekreft={handleBekreft}
      onClose={onClose}
    >
      <Tekst>
        Bestillingen avvises i Hotsak. Bruker og formidler vil se oppdatert status på nav.no innen neste virkedag. Det
        er ikke behov for å gjøre noe videre med saken i Gosys.
      </Tekst>
      <RadioGroup
        className={classes.avvisBestillingRadioGroup}
        legend="Velg årsak til at bestillingen avvises"
        error={valgtÅrsak === '' && error}
        value={valgtÅrsak}
        size="small"
        onChange={setValgtÅrsak}
      >
        <Tekst>Brukes kun internt av teamet som utvikler Hotsak, og vises ikke til bruker.</Tekst>
        {avvisÅrsaker.map((årsak, index) => (
          <Radio key={årsak} value={årsak} data-cy={`avvis-bestilling-arsak-${index}`}>
            {årsak}
          </Radio>
        ))}
      </RadioGroup>
      <Textarea
        label="Begrunnelse for å avvise bestillingen"
        description="Unngå personopplysninger. Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også bli brukt i videreutvikling av løsningen."
        value={begrunnelse}
        size="small"
        onChange={(e) => setBegrunnelse(e.target.value)}
      />
    </BekreftelsesDialog>
  )
}

const avvisÅrsaker: ReadonlyArray<string> = ['Duplikat av en annen bestilling', 'Annet']
