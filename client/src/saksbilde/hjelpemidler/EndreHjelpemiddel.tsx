import { useState } from 'react'
import styled from 'styled-components'

import { SaveFile } from '@navikt/ds-icons'
import { Button, Panel, Radio, RadioGroup, TextField } from '@navikt/ds-react'

import { Kolonne, Rad } from '../../felleskomponenter/Flex'
import { Strek } from '../../felleskomponenter/Strek'
import { Etikett } from '../../felleskomponenter/typografi'
import {
  EndreHjelpemiddelRequest,
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
} from '../../types/types.internal'
import { useHjelpemiddel } from './hjelpemiddelHook'

interface EndreHjelpemiddelProps {
  hmsNr: string
  hmsBeskrivelse: string
  nåværendeHmsNr?: string
  onLagre: (endreHjelpemiddel: EndreHjelpemiddelRequest) => void
  onAvbryt: () => void
}

const EtikettKolonne: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <Kolonne width="150px">{children}</Kolonne>
}

const EndreHjelpemiddelPanel = styled(Panel)`
  background-color: #f1f1f1;
`

const MAX_TEGN_BEGRUNNELSE_FRITEKST = 150

export const EndreHjelpemiddel: React.FC<EndreHjelpemiddelProps> = ({
  hmsNr: hmsNr,
  hmsBeskrivelse: hmsBeskrivelse,
  nåværendeHmsNr: nåværendeHmsNr,
  onLagre,
  onAvbryt,
}) => {
  const [endreBegrunnelse, setEndreBegrunnelse] = useState<EndretHjelpemiddelBegrunnelse | undefined>(undefined)
  const [endreBegrunnelseFritekst, setEndreBegrunnelseFritekst] = useState('')
  const [endreProduktHmsnr, setEndreProduktHmsnr] = useState('')
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { hjelpemiddel, isError } = useHjelpemiddel(endreProduktHmsnr)

  console.log(`Error: ${isError}`)

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
        <Rad style={{ marginBottom: '1rem' }}>
          <EtikettKolonne></EtikettKolonne>
          <Kolonne>
            <Rad>
              <Etikett>Endre artikkelnummer</Etikett>
            </Rad>
            <Rad>Her kan du erstatte artikkelnummeret begrunner har lagt inn.</Rad>
            <Rad style={{ marginTop: '1rem' }}>
              <Kolonne width="10rem">
                <Rad style={{ width: '8rem' }}>
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
                </Rad>
              </Kolonne>
              <Kolonne>
                <Rad>
                  <Etikett>Beskrivelse</Etikett>
                </Rad>
                <Rad style={{ marginTop: '.5rem', alignContent: 'center' }}>
                  {hmsNr !== '' && isError
                    ? 'Hmsnummer ikke funnet i hjelpemiddeldatabasen eller OEBS'
                    : hjelpemiddel?.navn ?? ''}
                </Rad>
              </Kolonne>
            </Rad>
            <Rad style={{ marginTop: '1rem' }}>
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
            </Rad>
            {endreBegrunnelse == EndretHjelpemiddelBegrunnelse.ANNET && (
              <Rad style={{ marginTop: '1rem', paddingRight: '1rem', maxWidth: '36rem' }}>
                <TextField
                  label="Begrunn endringen"
                  size="small"
                  description="Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også bli brukt i videreutvikling av løsningen."
                  value={endreBegrunnelseFritekst}
                  onChange={(event) => setEndreBegrunnelseFritekst(event.target.value)}
                  error={submitAttempt && errorBegrunnelseFritekst()}
                />
              </Rad>
            )}
            <Rad style={{ marginTop: '1rem' }}>
              <Button
                variant="secondary"
                size="small"
                style={{ marginRight: '1rem' }}
                loading={submitting}
                icon={<SaveFile />}
                onClick={async () => {
                  if (!validationError()) {
                    setSubmitting(true)
                    const begrunnelseFritekst =
                      endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ANNET
                        ? endreBegrunnelseFritekst
                        : EndretHjelpemiddelBegrunnelseLabel.get(endreBegrunnelse!)

                    await onLagre({
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
            </Rad>
          </Kolonne>
        </Rad>
      </EndreHjelpemiddelPanel>
      <Strek />
    </>
  )
}
