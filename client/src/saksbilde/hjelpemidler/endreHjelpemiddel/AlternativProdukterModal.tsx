import { Button, CheckboxGroup, Heading, HGrid, Modal } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { AlternativeProduct } from '../../../generated/finnAlternativprodukt.ts'
import { EndretHjelpemiddel, EndretHjelpemiddelBegrunnelse } from '../../../types/types.internal.ts'
import { AlternativProduktCard } from './AlternativProduktCard.tsx'

interface AlternativProduktModalProps {
  åpen: boolean
  hmsNr: string
  hjelpemiddelId: string
  onLagre(endreHjelpemiddel: EndretHjelpemiddel): void | Promise<void>
  onMutate: () => void
  alternativer: AlternativeProduct[]
  onLukk(): void
}

/*
Eksperiment for å teste konseptet om integrasjons med Finn Gjenbruksprodukt
*/
export function AlternativProdukterModal(props: AlternativProduktModalProps) {
  const { åpen, onLukk, alternativer, hjelpemiddelId, onLagre, onMutate } = props
  const [endretProdukt, setEndretProdukt] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const ref = useRef<HTMLDialogElement>(null)

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width="650px"
      open={åpen}
      onClose={onLukk}
      size="small"
      aria-label={'Endre hjelpemiddel'}
    >
      <Modal.Header>
        <Heading level="1" size="small">
          Alternativer
        </Heading>
      </Modal.Header>
      <Modal.Body>
        <CheckboxGroup
          legend="Velg alternativ"
          hideLegend
          name="alternativ"
          onChange={(val) => {
            setEndretProdukt(val.slice(-1))
          }}
          value={endretProdukt ?? ''}
          size="small"
        >
          <HGrid columns={'1fr 1fr'} gap="4">
            {alternativer.map((alternativ) => (
              <AlternativProduktCard
                key={alternativ.id}
                alternativ={alternativ}
                onMutate={onMutate}
                endretProdukt={endretProdukt}
              />
            ))}
          </HGrid>
        </CheckboxGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          size="small"
          loading={submitting}
          onClick={async () => {
            setSubmitting(true)

            // TODO: Fine ut om og hvordan vi skal be om begrunnelse for endring av hjelpemiddel
            await onLagre({
              hjelpemiddelId: hjelpemiddelId,
              hmsArtNr: endretProdukt[0] ?? '',
              begrunnelse: EndretHjelpemiddelBegrunnelse.ANNET,
              begrunnelseFritekst: 'Bytter til alternativt produkt via finn gjenbruksprodukt',
            })
            setSubmitting(false)
            onLukk()
          }}
        >
          Lagre endring
        </Button>
        <Button variant="tertiary" size="small" onClick={() => onLukk()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
