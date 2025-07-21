import { useRef, useState } from 'react'

import {
  Box,
  Button,
  ErrorMessage,
  Heading,
  HStack,
  Modal,
  Radio,
  RadioGroup,
  Textarea,
  TextField,
  VStack,
} from '@navikt/ds-react'
import { Etikett, Tekst } from '../../../felleskomponenter/typografi.tsx'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  EndretHjelpemiddelRequest,
} from '../../../types/types.internal.ts'
import { useHjelpemiddel } from './useHjelpemiddel.ts'

interface EndreHjelpemiddelModalProps {
  åpen: boolean
  hjelpemiddelId: string
  hmsArtNr: string
  nåværendeHmsArtNr?: string
  onLagre(endreHjelpemiddel: EndretHjelpemiddelRequest): void | Promise<void>
  onLukk(): void
}

export function EndreHjelpemiddelModal(props: EndreHjelpemiddelModalProps) {
  const { åpen, hjelpemiddelId, hmsArtNr, nåværendeHmsArtNr, onLagre, onLukk } = props
  const [submitting, setSubmitting] = useState(false)
  const [endreBegrunnelse, setEndreBegrunnelse] = useState<EndretHjelpemiddelBegrunnelse | undefined>(undefined)
  const [endreBegrunnelseFritekst, setEndreBegrunnelseFritekst] = useState('')

  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [endreProduktHmsnr, setEndreProduktHmsnr] = useState('')
  const { hjelpemiddel, isError } = useHjelpemiddel(endreProduktHmsnr)
  const ref = useRef<HTMLDialogElement>(null)

  const errorEndretProdukt = () => {
    if (!hjelpemiddel || hjelpemiddel?.hmsnr === nåværendeHmsArtNr) {
      return 'Du må oppgi et nytt, gyldig HMS-nr'
    }
  }

  const errorBegrunnelseFritekst = () => {
    if (endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ANNET && endreBegrunnelseFritekst.length === 0) {
      return 'Du må fylle inn en begrunnelse'
    }

    if (
      endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ANNET &&
      endreBegrunnelseFritekst.length > MAKS_TEGN_BEGRUNNELSE_FRITEKST
    ) {
      const antallForMange = endreBegrunnelseFritekst.length - MAKS_TEGN_BEGRUNNELSE_FRITEKST
      return `Antall tegn for mange ${antallForMange}`
    }
  }

  const errorBegrunnelse = () => {
    if (!endreBegrunnelse) {
      return 'Du må velge en begrunnelse'
    }
  }

  const validationError = () => {
    return errorEndretProdukt() || errorBegrunnelseFritekst() || errorBegrunnelse()
  }

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width="600px"
      open={åpen}
      onClose={onLukk}
      size="small"
      aria-label={'Endre hjelpemiddel'}
    >
      <Modal.Header>
        <Heading level="1" size="small">
          Endre HMS-nummer
        </Heading>
      </Modal.Header>
      <Modal.Body>
        <Box paddingBlock="0 4">
          <Tekst>Her kan du endre hjelpemidler som begrunner har lagt inn.</Tekst>
        </Box>
        <Box padding="6" background="bg-subtle" borderRadius="large">
          <VStack gap="3">
            <HStack gap="3" wrap={false}>
              <div>
                <TextField
                  label="HMS-nummer"
                  size="small"
                  maxLength={6}
                  onChange={(event) => {
                    if (event.target.value.length === 6) {
                      setEndreProduktHmsnr(event.target.value)
                    }
                  }}
                  error={submitAttempt && errorEndretProdukt()}
                />
              </div>
              <VStack gap="1">
                <Etikett>Beskrivelse</Etikett>
                <Tekst>
                  {hmsArtNr !== '' && isError ? (
                    <ErrorMessage>Hjelpemiddel ikke funnet i hjelpemiddeldatabasen eller OeBS</ErrorMessage>
                  ) : (
                    (hjelpemiddel?.navn ?? '')
                  )}
                </Tekst>
              </VStack>
            </HStack>
            <RadioGroup
              size="small"
              legend="Begrunnelse for å endre HMS-nummer:"
              onChange={(val) => setEndreBegrunnelse(val)}
              value={endreBegrunnelse ?? ''}
              error={submitAttempt && errorBegrunnelse()}
            >
              <Radio value={EndretHjelpemiddelBegrunnelse.RAMMEAVTALE}>
                {EndretHjelpemiddelBegrunnelseLabel.get(EndretHjelpemiddelBegrunnelse.RAMMEAVTALE)}
              </Radio>
              <Radio value={EndretHjelpemiddelBegrunnelse.GJENBRUK}>
                {EndretHjelpemiddelBegrunnelseLabel.get(EndretHjelpemiddelBegrunnelse.GJENBRUK)}
              </Radio>
              <Radio value={EndretHjelpemiddelBegrunnelse.ANNET}>
                {EndretHjelpemiddelBegrunnelseLabel.get(EndretHjelpemiddelBegrunnelse.ANNET)} (begrunn)
              </Radio>
            </RadioGroup>
            {endreBegrunnelse == EndretHjelpemiddelBegrunnelse.ANNET && (
              <Textarea
                label="Begrunn endringen"
                rows={3}
                size="small"
                description="Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også bli brukt i videreutvikling av løsningen."
                value={endreBegrunnelseFritekst}
                onChange={(event) => setEndreBegrunnelseFritekst(event.target.value)}
                error={submitAttempt && errorBegrunnelseFritekst()}
              />
            )}
          </VStack>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          size="small"
          loading={submitting}
          onClick={async () => {
            if (!validationError()) {
              setSubmitting(true)
              const begrunnelseFritekst =
                endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ANNET
                  ? endreBegrunnelseFritekst
                  : EndretHjelpemiddelBegrunnelseLabel.get(endreBegrunnelse!)

              await onLagre({
                hjelpemiddelId: hjelpemiddelId,
                hmsArtNr: endreProduktHmsnr,
                artikkelnavn: hjelpemiddel?.navn ?? '',
                begrunnelse: endreBegrunnelse!,
                begrunnelseFritekst: begrunnelseFritekst,
              })
              setSubmitting(false)
              onLukk()
            } else {
              setSubmitAttempt(true)
            }
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

const MAKS_TEGN_BEGRUNNELSE_FRITEKST = 150
