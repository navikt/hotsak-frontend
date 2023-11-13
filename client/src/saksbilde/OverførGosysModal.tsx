import React, { useRef, useState } from 'react'
import styled from 'styled-components'

import { Button, Checkbox, CheckboxGroup, Modal, Textarea } from '@navikt/ds-react'
import { Tekst } from '../felleskomponenter/typografi'
import type { OverforGosysTilbakemelding } from '../types/types.internal'
import { putSendTilGosys } from '../io/http'
import { useSWRConfig } from 'swr'

export interface OverførGosysModalProps {
  open: boolean
  loading: boolean
  årsaker: ReadonlyArray<string>
  legend?: string

  onBekreft(tilbakemelding: OverforGosysTilbakemelding): void | Promise<void>

  onClose(): void
}

export const OverførGosysModal: React.FC<OverførGosysModalProps> = ({
  open,
  loading,
  årsaker = ['Annet'],
  legend = 'Hva må til for at du skulle kunne behandlet denne saken i Hotsak?',
  onBekreft,
  onClose,
}) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [valgteArsaker, setValgteArsaker] = useState<string[]>([])
  const [begrunnelse, setBegrunnelse] = useState<string>('')
  const [error, setError] = useState('')
  const manglerArsak = !valgteArsaker.length
  const manglerBegrunnelse = valgteArsaker.includes('Annet') && begrunnelse.trim().length < 3
  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      open={open}
      onClose={onClose}
      header={{ heading: 'Overfør til Gosys' }}
    >
      <Modal.Body>
        <Tekst>
          Hvis du overfører saken til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og
          videre saksbehandling må gjøres manuelt i Gosys og Infotrygd. Merk at det kan ta noen minutter før saken
          dukker opp i Gosys.
        </Tekst>
        <OverforGosysArsakCheckboxGroup
          legend={legend}
          error={(manglerArsak || manglerBegrunnelse) && error}
          value={valgteArsaker}
          onChange={setValgteArsaker}
        >
          <Tekst>Brukes kun internt av teamet som utvikler Hotsak, og vises ikke i Gosys.</Tekst>
          {årsaker.map((årsak, index) => (
            <Checkbox key={årsak} value={årsak} data-cy={`overfor-soknad-arsak-${index}`}>
              {årsak}
            </Checkbox>
          ))}
        </OverforGosysArsakCheckboxGroup>
        <Textarea
          label="Begrunnelse (valgfri)"
          description="Gi en kort forklaring for hvorfor du ikke kan behandle saken. Unngå personopplysninger."
          value={begrunnelse}
          onChange={(e) => setBegrunnelse(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            if (manglerArsak) {
              setError('Du må velge minst en årsak i listen over.')
            } else if (manglerBegrunnelse) {
              setError('Du må gi en begrunnelse når det er huket av for Annet.')
            } else {
              onBekreft({
                valgteArsaker,
                begrunnelse,
              })
            }
          }}
          data-cy="btn-overfor-soknad"
          disabled={loading}
          loading={loading}
        >
          Overfør til Gosys
        </Button>
        <Button variant="secondary" size="small" onClick={onClose} disabled={loading}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const OverforGosysArsakCheckboxGroup = styled(CheckboxGroup)`
  margin: var(--a-spacing-4) 0;
`

export function useOverførGosys(
  sakId: string,
  årsaker: ReadonlyArray<string> = ['Annet']
): OverførGosysModalProps & {
  onOpen(): void
} {
  const { mutate } = useSWRConfig()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  return {
    open,
    loading,
    årsaker,
    onOpen() {
      setOpen(true)
    },
    onClose() {
      setOpen(false)
    },
    async onBekreft(tilbakemelding) {
      setLoading(true)
      try {
        await putSendTilGosys(sakId, tilbakemelding)
        await mutate(`api/sak/${sakId}`, `api/sak/${sakId}/historikk`)
      } finally {
        setLoading(false)
        setOpen(false)
      }
    },
  }
}
