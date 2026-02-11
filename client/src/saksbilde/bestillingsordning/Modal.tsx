import { Alert, Box, Button, Heading, HStack, Textarea, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Tekst } from '../../felleskomponenter/typografi'
import { BekreftelseModal } from '../komponenter/BekreftelseModal'

export interface OrdreModalProps {
  loading?: boolean
  open?: boolean
  onBekreft(): any | Promise<any>
  onClose(): void | Promise<void>
}

export interface FormModalProps extends OrdreModalProps {
  leveringsmerknad?: string
  harLagretBeskjed: boolean
  error?: boolean
  onLagre(merknad: string): any | Promise<any> | null
  onEndre(): void
}

export function BekreftAutomatiskOrdre({
  open,
  onBekreft,
  loading,
  onClose,
  leveringsmerknad,
  harLagretBeskjed,
  error,
  onLagre,
  onEndre,
}: FormModalProps) {
  return (
    <BekreftelseModal
      width="700px"
      open={open}
      heading="Godkjenn bestillingen"
      bekreftButtonLabel="Godkjenn bestillingen"
      onBekreft={onBekreft}
      loading={loading}
      onClose={onClose}
    >
      <VStack gap="4">
        {leveringsmerknad && (
          <FritekstPanel
            leveringsmerknad={leveringsmerknad}
            harLagretBeskjed={harLagretBeskjed}
            onLagre={onLagre}
            onEndre={onEndre}
            error={error}
          />
        )}
        <Tekst>
          Når du godkjenner bestillingen blir det automatisk opprettet og klargjort en ordre i OeBS. Du trenger ikke
          gjøre noe mer med saken.
        </Tekst>
      </VStack>
    </BekreftelseModal>
  )
}

export function FritekstPanel({
  leveringsmerknad,
  error,
  onLagre,
  onEndre,
  harLagretBeskjed,
}: {
  leveringsmerknad: string
  harLagretBeskjed: boolean
  error?: boolean
  onLagre: any | Promise<any>
  onEndre: () => void
}) {
  const MAX_LENGDE_BESKJED = 150
  const [redigertTekst, setRedigertTekst] = useState(leveringsmerknad)
  const [beskjedlengdeError, setBeskjedlengdeError] = useState(false)

  return (
    <Box.New padding="4" background="neutral-soft">
      <VStack gap="4">
        <Heading level="2" size="xsmall" spacing>
          Beskjed fra formidler til kommunen om utlevering
        </Heading>
        <Alert variant="info" size="small" inline>
          Beskjeden fra formidler vil vises på følgeseddelen til hjelpemidlene, på 5.17-skjema.
        </Alert>

        <form>
          <VStack gap="4">
            <Textarea
              label="Beskjed til kommunen"
              description="Sjekk teksten og fjern sensitive opplysninger"
              size="small"
              value={redigertTekst}
              maxLength={MAX_LENGDE_BESKJED}
              readOnly={harLagretBeskjed}
              error={
                (error &&
                  'Du må sjekke at beskjeden ikke inneholder personopplysninger eller sensitiv informasjon og lagre den før du kan godkjennne bestillingen.') ||
                (beskjedlengdeError && `Kort ned beskjeden slik at den er under ${MAX_LENGDE_BESKJED} tegn.`)
              }
              onChange={(e) => {
                if (beskjedlengdeError && e.target.value.length <= MAX_LENGDE_BESKJED) {
                  setBeskjedlengdeError(false)
                }
                setRedigertTekst(e.target.value)
              }}
            />
            <HStack justify="end">
              {harLagretBeskjed ? (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault()
                    onEndre()
                  }}
                >
                  Endre beskjed
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault()
                    if (redigertTekst.length > MAX_LENGDE_BESKJED) {
                      setBeskjedlengdeError(true)
                      return
                    }
                    onLagre(redigertTekst)
                  }}
                >
                  Lagre beskjed
                </Button>
              )}
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Box.New>
  )
}

export function BekreftManuellOrdre({ open, onBekreft, loading, onClose }: OrdreModalProps) {
  return (
    <BekreftelseModal
      width="600px"
      open={open}
      heading="Opprett ordre i OeBS"
      bekreftButtonLabel="Opprett ordre i OeBS"
      onBekreft={onBekreft}
      loading={loading}
      onClose={onClose}
    >
      <Tekst spacing>
        Når du oppretter ordre i OeBS må du etterpå gå til OeBS for å fullføre den. Husk å utføre de nødvendige
        oppgavene i OeBS før du klargjør ordren. Ordrenummeret vil vises under Historikk i løpet av kort tid.
      </Tekst>
    </BekreftelseModal>
  )
}
