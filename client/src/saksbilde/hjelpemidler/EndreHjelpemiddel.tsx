import { useState } from 'react'
import styled from 'styled-components'

import { FloppydiskIcon } from '@navikt/aksel-icons'
import { Box, Button, ErrorMessage, HStack, Radio, RadioGroup, TextField, VStack } from '@navikt/ds-react'
import { Strek } from '../../felleskomponenter/Strek'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import {
  EndreHjelpemiddelRequest,
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
} from '../../types/types.internal'
import { useHjelpemiddel } from './useHjelpemiddel'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'

interface EndreHjelpemiddelProps {
  hjelpemiddelId: number
  hmsNr: string
  hmsBeskrivelse: string
  nåværendeHmsNr?: string
  onLagre(endreHjelpemiddel: EndreHjelpemiddelRequest): void | Promise<void>
  onAvbryt(): void
}

export function EndreHjelpemiddel({
  hjelpemiddelId: hjelpemiddelId,
  hmsNr: hmsNr,
  hmsBeskrivelse: hmsBeskrivelse,
  nåværendeHmsNr: nåværendeHmsNr,
  onLagre,
  onAvbryt,
}: EndreHjelpemiddelProps) {
  const [endreBegrunnelse, setEndreBegrunnelse] = useState<EndretHjelpemiddelBegrunnelse | undefined>(undefined)
  const [endreBegrunnelseFritekst, setEndreBegrunnelseFritekst] = useState('')
  const [endreProduktHmsnr, setEndreProduktHmsnr] = useState('')
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { hjelpemiddel, isError } = useHjelpemiddel(endreProduktHmsnr)

  const errorEndretProdukt = () => {
    if (!hjelpemiddel || hjelpemiddel?.hmsnr === nåværendeHmsNr) {
      return 'Du må oppgi et nytt, gyldig HMS-nr'
    }
  }

  const errorBegrunnelseFritekst = () => {
    if (endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ANNET && endreBegrunnelseFritekst.length === 0) {
      return 'Du må fylle inn en begrunnelse'
    }

    if (
      endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ANNET &&
      endreBegrunnelseFritekst.length > MAX_TEGN_BEGRUNNELSE_FRITEKST
    ) {
      const antallForMange = endreBegrunnelseFritekst.length - MAX_TEGN_BEGRUNNELSE_FRITEKST
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
    <>
      <EndreHjelpemiddelPanel>
        <div />
        <Box paddingBlock="4">
          <VStack gap="3">
            <div>
              <Etikett spacing>Endre artikkelnummer</Etikett>
              <Tekst>Her kan du erstatte artikkelnummeret begrunner har lagt inn.</Tekst>
            </div>
            <HStack gap="3">
              <TextField
                label="Artikkelnummer"
                size="small"
                maxLength={6}
                onChange={(event) => {
                  if (event.target.value.length === 6) {
                    setEndreProduktHmsnr(event.target.value)
                  }
                }}
                error={submitAttempt && errorEndretProdukt()}
              />
              <VStack gap="3">
                <Etikett>Beskrivelse</Etikett>
                <Tekst>
                  {hmsNr !== '' && isError ? (
                    <ErrorMessage>Hjelpemiddel ikke funnet i hjelpemiddeldatabasen eller OeBS</ErrorMessage>
                  ) : (
                    (hjelpemiddel?.navn ?? '')
                  )}
                </Tekst>
              </VStack>
            </HStack>
            <RadioGroup
              size="small"
              legend="Begrunnelse for å endre artikkelnummer:"
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
              <TextField
                label="Begrunn endringen"
                size="small"
                description="Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også bli brukt i videreutvikling av løsningen."
                value={endreBegrunnelseFritekst}
                onChange={(event) => setEndreBegrunnelseFritekst(event.target.value)}
                error={submitAttempt && errorBegrunnelseFritekst()}
              />
            )}
            <HStack gap="3">
              <Button
                variant="secondary"
                size="small"
                loading={submitting}
                icon={<FloppydiskIcon />}
                onClick={async () => {
                  if (!validationError()) {
                    setSubmitting(true)
                    const begrunnelseFritekst =
                      endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ANNET
                        ? endreBegrunnelseFritekst
                        : EndretHjelpemiddelBegrunnelseLabel.get(endreBegrunnelse!)

                    await onLagre({
                      hjelpemiddelId: hjelpemiddelId,
                      hmsNr: hmsNr,
                      hmsBeskrivelse: hmsBeskrivelse,
                      endretHmsNr: endreProduktHmsnr,
                      endretHmsBeskrivelse: hjelpemiddel?.navn || '',
                      begrunnelse: endreBegrunnelse!,
                      begrunnelseFritekst: begrunnelseFritekst,
                    })
                    setSubmitting(false)
                  } else {
                    setSubmitAttempt(true)
                  }
                }}
              >
                Lagre
              </Button>
              <Button variant="tertiary" size="small" onClick={() => onAvbryt()}>
                Avbryt
              </Button>
            </HStack>
          </VStack>
        </Box>
      </EndreHjelpemiddelPanel>
      <Strek />
    </>
  )
}

const EndreHjelpemiddelPanel = styled(HjelpemiddelGrid)`
  background-color: var(--a-bg-subtle);
`

const MAX_TEGN_BEGRUNNELSE_FRITEKST = 150
