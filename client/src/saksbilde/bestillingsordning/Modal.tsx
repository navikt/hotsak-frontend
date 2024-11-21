import { Alert, Box, Button, Heading, HStack, Textarea, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Brødtekst } from '../../felleskomponenter/typografi'
import { BekreftelseModal } from '../komponenter/BekreftelseModal'

export interface OrdreModalProps {
  loading?: boolean
  open?: boolean
  onBekreft(): any | Promise<any>
  onClose(): void | Promise<void>
}

export interface FormModalProps extends OrdreModalProps {
  leveringsmerknad?: string
  error?: boolean
  onLagre(merknad: string): any | Promise<any> | null
}

export function BekreftAutomatiskOrdre({
  open,
  onBekreft,
  loading,
  onClose,
  leveringsmerknad,
  error,
  onLagre,
}: FormModalProps) {
  return (
    <BekreftelseModal
      width="700px"
      open={open}
      heading="Godkjenn bestillingen"
      buttonLabel="Godkjenn bestillingen"
      onBekreft={onBekreft}
      loading={loading}
      onClose={onClose}
    >
      <VStack gap="4">
        {leveringsmerknad && <FritekstPanel leveringsmerknad={leveringsmerknad} onLagre={onLagre} error={error} />}
        <Brødtekst>
          Når du godkjenner bestillingen blir det automatisk opprettet og klargjort en ordre i OEBS. Du trenger ikke
          gjøre noe mer med saken.
        </Brødtekst>
      </VStack>
    </BekreftelseModal>
  )
}

export function FritekstPanel({
  leveringsmerknad,
  error,
  onLagre,
}: {
  leveringsmerknad: string
  error?: boolean
  onLagre: any | Promise<any>
}) {
  const [redigertTekst, setRedigertTekst] = useState(leveringsmerknad)

  return (
    <Box padding="4" background="surface-subtle">
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
              maxLength={200}
              error={error && 'Beskjeden må lagres før du godkjenner bestillingen.'}
              onChange={(e) => setRedigertTekst(e.target.value)}
            />
            <HStack justify="end">
              <Button
                variant="secondary"
                size="small"
                onClick={(e) => {
                  e.preventDefault()
                  onLagre(redigertTekst)
                }}
              >
                Lagre beskjed
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Box>
  )
}

export function BekreftManuellOrdre({ open, onBekreft, loading, onClose }: OrdreModalProps) {
  return (
    <BekreftelseModal
      width="600px"
      open={open}
      heading="Opprett ordre i OeBS"
      buttonLabel="Opprett ordre i OeBS"
      onBekreft={onBekreft}
      loading={loading}
      onClose={onClose}
    >
      <Brødtekst spacing>
        Når du oppretter ordre i OeBS må du etterpå gå til OeBS for å fullføre den. Husk å utføre de nødvendige
        oppgavene i OeBS før du klargjør ordren. Ordrenummeret vil vises under Historikk i løpet av kort tid.
      </Brødtekst>
    </BekreftelseModal>
  )
}
