import { useRef, useState } from 'react'

import { ClockDashedIcon } from '@navikt/aksel-icons'
import { Box, Button, Checkbox, CheckboxGroup, Heading, HGrid, HStack, Modal, Tag, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { AlternativeProduct } from '../../../generated/finnAlternativprodukt.ts'
import { EndretHjelpemiddel, EndretHjelpemiddelBegrunnelse } from '../../../types/types.internal.ts'
import { formaterRelativTid } from '../../../utils/dato.ts'

interface AlternativProduktModalProps {
  åpen: boolean
  hmsNr: string
  hjelpemiddelId: string
  onLagre(endreHjelpemiddel: EndretHjelpemiddel): void | Promise<void>
  alternativer: AlternativeProduct[]
  onLukk(): void
}

/*
Eksperiment for å teste konseptet om integrasjons med Finn Gjenbruksprodukt
*/
export function AlternativProdukterModal(props: AlternativProduktModalProps) {
  const { åpen, onLukk, alternativer, hjelpemiddelId, onLagre } = props
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
          <VStack gap="3">
            {alternativer.map((alternativ) => (
              <Box key={alternativ.id} borderWidth="1" borderColor="border-subtle" borderRadius={'large'} padding="4">
                <HGrid columns="2fr 1fr" gap="2">
                  <VStack gap="1">
                    <Etikett size="small">
                      {alternativ.hmsArtNr}: {alternativ.title}
                    </Etikett>
                    {alternativ.title.toLowerCase() !== alternativ.articleName.toLowerCase() && (
                      <Brødtekst>{alternativ.articleName}</Brødtekst>
                    )}
                    <Brødtekst>{alternativ.supplier.name}</Brødtekst>
                    <HGrid columns={'1fr 1fr'}>
                      {alternativ.wareHouseStock?.map((lagerstatus) => (
                        <VStack key={lagerstatus?.location}>
                          <Etikett>{lagerstatus?.location}: </Etikett>
                          <div>
                            <Tag variant="success" size="xsmall">
                              {lagerstatus?.available} stk på lager
                            </Tag>
                          </div>
                          <div style={{ gridColumn: '1 / -1', paddingTop: '0.2rem' }}>
                            <Undertittel>{formaterRelativTid(lagerstatus?.updated)}</Undertittel>
                          </div>
                        </VStack>
                      ))}
                    </HGrid>

                    <HStack gap="2" paddingBlock={'4 0'}>
                      <div>
                        <Button variant="tertiary" size="small" icon={<ClockDashedIcon />}>
                          Sjekk lagerstatus
                        </Button>
                      </div>
                    </HStack>
                  </VStack>
                  <div>
                    <Checkbox value={alternativ.hmsArtNr}>Bytt til denne</Checkbox>
                  </div>
                </HGrid>
              </Box>
            ))}
          </VStack>
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
