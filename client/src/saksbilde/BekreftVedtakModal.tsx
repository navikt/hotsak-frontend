import React from 'react'

import { Button, Heading } from '@navikt/ds-react'

import { Knappepanel } from '../felleskomponenter/Button'
import { DialogBoks } from '../felleskomponenter/Dialogboks'
import { Tekst } from '../felleskomponenter/typografi'

interface BekreftVedtakModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const BekreftVedtakModal: React.FC<BekreftVedtakModalProps> = ({ open, onBekreft, loading, onClose }) => {
  return (
    <DialogBoks
      width="600px"
      shouldCloseOnOverlayClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
    >
      <DialogBoks.Content>
        <Heading level="1" size="medium" spacing={true}>
          Vil du innvilge søknaden?
        </Heading>
        <Tekst>
          Ved å innvilge søknaden blir det fattet et vedtak i saken og opprettet en serviceforespørsel i OEBS.
        </Tekst>
        <Tekst>Innbygger vil få beskjed om vedtaket på Ditt NAV.</Tekst>
        <Knappepanel>
          <Button
            variant="primary"
            size="small"
            onClick={() => onBekreft()}
            data-cy="btn-innvilg-soknad"
            disabled={loading}
            loading={loading}
          >
            Innvilg søknaden
          </Button>
          <Button variant="secondary" size="small" onClick={() => onClose()} disabled={loading}>
            Avbryt
          </Button>
        </Knappepanel>
      </DialogBoks.Content>
    </DialogBoks>
  )
}
