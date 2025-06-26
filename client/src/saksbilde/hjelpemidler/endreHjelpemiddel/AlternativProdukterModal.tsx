import { Button, CheckboxGroup, Heading, HGrid, Modal, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react'
import { useEffect, useRef, useState } from 'react'
import { AlternativeProduct } from '../../../generated/finnAlternativprodukt.ts'
import {
  EndretAlternativProduktBegrunnelse,
  EndretAlternativProduktBegrunnelseLabel,
  EndretHjelpemiddel,
} from '../../../types/types.internal.ts'
import { useSjekkLagerstatus } from '../useSjekkLagerstatus.ts'
import { AlternativProduktCard } from './AlternativProduktCard.tsx'

interface AlternativProduktModalProps {
  åpen: boolean
  hmsNr: string
  hjelpemiddelId: string
  onLagre(endreHjelpemiddel: EndretHjelpemiddel): void | Promise<void>
  onMutate: () => void
  alternativer: AlternativeProduct[]
  alleAlternativer: AlternativeProduct[]
  onLukk(): void
}

/*
Eksperiment for å teste konseptet om integrasjons med Finn Gjenbruksprodukt
*/
export function AlternativProdukterModal(props: AlternativProduktModalProps) {
  const { åpen, onLukk, alternativer, alleAlternativer, hjelpemiddelId, onLagre, onMutate } = props
  const [endretProdukt, setEndretProdukt] = useState<string[]>([])
  const [nyttProduktValgt, setNyttProduktValgt] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [endreBegrunnelse, setEndreBegrunnelse] = useState<EndretAlternativProduktBegrunnelse | undefined>(undefined)
  const [endreBegrunnelseFritekst, setEndreBegrunnelseFritekst] = useState('')
  const { sjekkLagerstatusFor, harOppdatertLagerstatus } = useSjekkLagerstatus()
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const ref = useRef<HTMLDialogElement>(null)

  const hmsnrForAlternativer = alleAlternativer.map((a) => a.hmsArtNr)
  const [henterLagerstatus, setHenterLagerstatus] = useState(false)

  useEffect(() => {
    if (!henterLagerstatus && åpen && !harOppdatertLagerstatus) {
      setHenterLagerstatus(true)
      const oppdaterLagerstatus = async () => {
        await sjekkLagerstatusFor(hmsnrForAlternativer)
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Må midlertidig vente litt før ny lagerstatus er oppdatert

        await onMutate()
        setHenterLagerstatus(false)
      }
      console.log('Nå er det på tide å sjekke lagerstatus for disse hmsnr:', hmsnrForAlternativer)
      oppdaterLagerstatus()
      console.log('Da har vi ny lagerstatus')
    }
  }, [åpen, hmsnrForAlternativer, harOppdatertLagerstatus])

  const errorBegrunnelse = () => {
    if (!endreBegrunnelse) {
      return 'Du må velge en begrunnelse'
    }
  }

  const validationError = () => {
    return errorBegrunnelseFritekst() || errorBegrunnelse()
  }

  const errorBegrunnelseFritekst = () => {
    if (
      endreBegrunnelse === EndretAlternativProduktBegrunnelse.ALTERNATIV_PRODUKT_ANNET &&
      endreBegrunnelseFritekst.length === 0
    ) {
      return 'Du må fylle inn en begrunnelse'
    }

    if (
      endreBegrunnelse === EndretAlternativProduktBegrunnelse.ALTERNATIV_PRODUKT_ANNET &&
      endreBegrunnelseFritekst.length > MAX_TEGN_BEGRUNNELSE_FRITEKST
    ) {
      const antallForMange = endreBegrunnelseFritekst.length - MAX_TEGN_BEGRUNNELSE_FRITEKST
      return `Antall tegn for mange ${antallForMange}`
    }
  }

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
      <Modal.Body>
        {!nyttProduktValgt ? (
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
            <HGrid columns={'1fr 1fr'} gap="4" paddingBlock={'2 0'}>
              {alternativer.map((alternativ) => (
                <AlternativProduktCard
                  key={alternativ.id}
                  alternativ={alternativ}
                  onMutate={onMutate}
                  endretProdukt={endretProdukt}
                  lagerstatusLoading={henterLagerstatus}
                  skjulLagerstatusKnapp={harOppdatertLagerstatus}
                />
              ))}
            </HGrid>
          </CheckboxGroup>
        ) : (
          <VStack gap="3" paddingBlock="4 0">
            <RadioGroup
              size="small"
              legend="Begrunnelse for å endre HMS-nummer:"
              onChange={(val) => setEndreBegrunnelse(val)}
              value={endreBegrunnelse ?? ''}
              error={submitAttempt && errorBegrunnelse()}
            >
              <Radio value={EndretAlternativProduktBegrunnelse.ALTERNATIV_PRODUKT_LAGERVARE}>
                {EndretAlternativProduktBegrunnelseLabel.get(
                  EndretAlternativProduktBegrunnelse.ALTERNATIV_PRODUKT_LAGERVARE
                )}
              </Radio>
              <Radio value={EndretAlternativProduktBegrunnelse.ALTERNATIV_PRODUKT_ANNET}>
                {EndretAlternativProduktBegrunnelseLabel.get(
                  EndretAlternativProduktBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                )}
                (begrunn)
              </Radio>
            </RadioGroup>
            {endreBegrunnelse == EndretAlternativProduktBegrunnelse.ALTERNATIV_PRODUKT_ANNET && (
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
        )}
      </Modal.Body>
      <Modal.Footer>
        {!nyttProduktValgt ? (
          <Button
            variant="primary"
            size="small"
            loading={submitting}
            onClick={async () => {
              setNyttProduktValgt(true)
            }}
          >
            Lagre endring
          </Button>
        ) : (
          <Button
            variant="primary"
            size="small"
            loading={submitting}
            onClick={async () => {
              if (!validationError()) {
                setSubmitting(true)
                const begrunnelseFritekst =
                  endreBegrunnelse === EndretAlternativProduktBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                    ? endreBegrunnelseFritekst
                    : EndretAlternativProduktBegrunnelseLabel.get(endreBegrunnelse!)

                await onLagre({
                  hjelpemiddelId: hjelpemiddelId,
                  hmsArtNr: endretProdukt[0] ?? '',
                  begrunnelse: endreBegrunnelse!,
                  begrunnelseFritekst: begrunnelseFritekst,
                })
                setSubmitting(false)
                setNyttProduktValgt(false)
                onLukk()
              } else {
                setSubmitAttempt(true)
              }
            }}
          >
            Ferdig
          </Button>
        )}

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
    </Modal>
  )
}

const MAX_TEGN_BEGRUNNELSE_FRITEKST = 150
