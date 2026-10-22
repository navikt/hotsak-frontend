import { Button, ErrorMessage, HStack, TextField, VStack } from '@navikt/ds-react'
import { type FormEvent, useState } from 'react'

import { type Veiadresse } from '../../../types/hotlibs.ts'

interface BrevadresseSkjemaProps {
  initiellAdresse?: Veiadresse
  formidlerNavn?: string
  isLoading: boolean
  feilmelding?: string
  onLagre(adresse: Veiadresse): void
  onAvbryt(): void
}

type Feil = Partial<Record<'adresselinje1' | 'postnummer' | 'poststed', string>>

export function BrevadresseSkjema({
  initiellAdresse,
  formidlerNavn,
  isLoading,
  feilmelding,
  onLagre,
  onAvbryt,
}: BrevadresseSkjemaProps) {
  const [adresselinje1, setAdresselinje1] = useState(initiellAdresse?.adresselinje1 ?? '')
  const [adresselinje2, setAdresselinje2] = useState(
    initiellAdresse?.adresselinje2 ? (initiellAdresse.adresselinje2 ?? '') : formidlerNavn ? `v/ ${formidlerNavn}` : ''
  )
  const [adresselinje3, setAdresselinje3] = useState(initiellAdresse?.adresselinje3 ?? '')
  const [postnummer, setPostnummer] = useState(initiellAdresse?.postnummer ?? '')
  const [poststed, setPoststed] = useState(initiellAdresse?.poststed ?? '')
  const [feil, setFeil] = useState<Feil>({})

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nyeFeil: Feil = {}
    if (!adresselinje1.trim()) nyeFeil.adresselinje1 = 'Du må fylle ut adresselinje 1'
    if (!postnummer.trim()) nyeFeil.postnummer = 'Du må fylle ut postnummer'
    else if (!/^\d{4}$/.test(postnummer.trim())) nyeFeil.postnummer = 'Postnummer må være fire siffer'
    if (!poststed.trim()) nyeFeil.poststed = 'Du må fylle ut poststed'
    setFeil(nyeFeil)
    if (Object.keys(nyeFeil).length > 0) return

    onLagre({
      adresselinje1: adresselinje1.trim(),
      adresselinje2: adresselinje2.trim() || undefined,
      adresselinje3: adresselinje3.trim() || undefined,
      postnummer: postnummer.trim(),
      poststed: poststed.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <VStack gap="space-6">
        <TextField
          size="small"
          label="Adresselinje 1"
          value={adresselinje1}
          onChange={(e) => setAdresselinje1(e.target.value)}
          error={feil.adresselinje1}
        />
        <TextField
          size="small"
          label="Adresselinje 2 (valgfri)"
          value={adresselinje2}
          onChange={(e) => setAdresselinje2(e.target.value)}
        />
        <TextField
          size="small"
          label="Adresselinje 3 (valgfri)"
          value={adresselinje3}
          onChange={(e) => setAdresselinje3(e.target.value)}
        />
        <HStack gap="space-4" align="start">
          <TextField
            size="small"
            label="Postnummer"
            inputMode="numeric"
            htmlSize={6}
            value={postnummer}
            onChange={(e) => setPostnummer(e.target.value)}
            error={feil.postnummer}
          />
          <TextField
            size="small"
            label="Poststed"
            value={poststed}
            onChange={(e) => setPoststed(e.target.value)}
            error={feil.poststed}
          />
        </HStack>
        {feilmelding && (
          <ErrorMessage showIcon size="small">
            {feilmelding}
          </ErrorMessage>
        )}
        <HStack gap="space-4">
          <Button type="submit" size="small" loading={isLoading}>
            Lagre mottaker
          </Button>
          <Button type="button" size="small" variant="tertiary" onClick={onAvbryt} disabled={isLoading}>
            Avbryt
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}
