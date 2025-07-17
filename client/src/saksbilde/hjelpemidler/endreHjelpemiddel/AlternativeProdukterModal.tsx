import { Button, Heading, Modal } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import type { AlternativeProduct } from '../useAlternativeProdukter.ts'
import { AlternativtProduktVelger } from './AlternativtProduktVelger.tsx'
import { BegrunnelseForBytte } from './BegrunnelseForBytte.tsx'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  EndretHjelpemiddelRequest,
} from '../../../types/types.internal.ts'

interface AlternativProduktModalProps {
  åpen: boolean
  hmsNr: string
  hjelpemiddelId: string
  alternativer: AlternativeProduct[]
  alleAlternativer: AlternativeProduct[]
  onLagre(endreHjelpemiddel: EndretHjelpemiddelRequest): void | Promise<void>
  onLukk(): void
}

export function AlternativeProdukterModal(props: AlternativProduktModalProps) {
  const { åpen, onLukk, alternativer, hjelpemiddelId, onLagre } = props
  const [nyttProduktValgt, setNyttProduktValgt] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const ref = useRef<HTMLDialogElement>(null)

  const methods = useForm<EndreArtikkelData>({
    defaultValues: {
      endretProdukt: '',
      endreBegrunnelse: undefined,
      endreBegrunnelseFritekst: '',
    },
  })

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width="650px"
      open={åpen}
      onClose={() => {
        setNyttProduktValgt(false)
        onLukk()
      }}
      size="small"
      aria-label={'Endre hjelpemiddel'}
    >
      <Modal.Header>
        <Heading level="1" size="small">
          {!nyttProduktValgt ? `Alternativer` : `Velg begrunnelse for å bytte hjelpemiddel`}
        </Heading>
      </Modal.Header>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(async (data) => {
            if (!nyttProduktValgt) {
              setNyttProduktValgt(true)
            } else {
              setSubmitting(true)
              const begrunnelseFritekst =
                data.endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                  ? data.endreBegrunnelseFritekst
                  : EndretHjelpemiddelBegrunnelseLabel.get(data.endreBegrunnelse!)
              await onLagre({
                hjelpemiddelId: hjelpemiddelId,
                hmsArtNr: data.endretProdukt[0] ?? '',
                begrunnelse: data.endreBegrunnelse!,
                begrunnelseFritekst: begrunnelseFritekst,
              })
              setSubmitting(false)
              setNyttProduktValgt(false)
              onLukk()
            }
          })}
        >
          <Modal.Body>
            {!nyttProduktValgt ? <AlternativtProduktVelger alternativer={alternativer} /> : <BegrunnelseForBytte />}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary" size="small" loading={submitting}>
              {!nyttProduktValgt ? 'Lagre endring' : 'Ferdig'}
            </Button>
            <Button
              variant="tertiary"
              size="small"
              onClick={() => {
                setNyttProduktValgt(false)
                onLukk()
              }}
            >
              Avbryt
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  )
}

interface EndreArtikkelData {
  endretProdukt: string
  endreBegrunnelse: EndretHjelpemiddelBegrunnelse | undefined
  endreBegrunnelseFritekst: ''
}
