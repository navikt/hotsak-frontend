import React, { useRef } from 'react'

import { Button, Modal } from '@navikt/ds-react'
import { Tekst } from '../felleskomponenter/typografi'

interface BekreftVedtakModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const BekreftVedtakModal: React.FC<BekreftVedtakModalProps> = ({ open, onBekreft, loading, onClose }) => {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width="600px"
      open={open}
      onClose={() => {
        onClose()
      }}
      header={{ heading: 'Vil du innvilge søknaden?' }}
    >
      <Modal.Body>
        <Tekst>
          Ved å innvilge søknaden blir det fattet et vedtak i saken og opprettet en serviceforespørsel i OEBS.
        </Tekst>
        <Tekst>Innbygger vil få beskjed om vedtaket på Ditt NAV.</Tekst>
      </Modal.Body>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  )
}
