import { Box, Button, HStack, TextField } from '@navikt/ds-react'
import { useState } from 'react'
import { useParams } from 'react-router'

import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { formaterKontonummer } from '../../../../utils/formater'
import { useKontonummer } from './useKontonummer'

export interface UtbetalingsmottakerProps {
  defaultInnsenderFnr?: string
}

export function Utbetalingsmottaker(props: UtbetalingsmottakerProps) {
  const { defaultInnsenderFnr } = props
  const { saksnummer: sakId } = useParams<{ saksnummer: string }>()
  const [textFieldValue, setTextFieldValue] = useState(defaultInnsenderFnr || '')
  const [innsenderFnr, setInnsenderFnr] = useState(defaultInnsenderFnr || '')
  const { data: kontoinformasjon, error, loading } = useKontonummer(sakId, innsenderFnr)

  const kontonummerFunnet = kontoinformasjon?.kontonummer && kontoinformasjon.kontonummer !== ''

  return (
    <>
      <HStack gap="2" align="end">
        <TextField
          label="Fødselsnummer innsender"
          size="small"
          value={textFieldValue}
          onChange={(e) => setTextFieldValue(e.target.value)}
        />
        <Button
          variant="secondary"
          size="small"
          loading={loading}
          disabled={loading}
          onClick={(e) => {
            e.preventDefault()
            setInnsenderFnr(textFieldValue)
          }}
        >
          Hent kontonummer
        </Button>
      </HStack>
      <Box marginBlock="3">
        {kontoinformasjon && !kontonummerFunnet && (
          <SkjemaAlert variant="error">
            {`Fant ikke kontonummer for ${
              kontoinformasjon?.navn && kontoinformasjon.navn !== '' ? kontoinformasjon.navn : innsenderFnr
            }. Kontakt personen og be dem legge inn kontonummer hos Nav.`}
          </SkjemaAlert>
        )}
        {error?.isNotFound() && (
          <SkjemaAlert variant="error">
            {`Klarte ikke å hente kontonummer for ${innsenderFnr}. Prøv igjen om noen minutter. Hvis problemet ikke løser seg, kontakt DigiHoT.`}
          </SkjemaAlert>
        )}
        {kontonummerFunnet && (
          <SkjemaAlert variant="info">{`Kontonummer for ${kontoinformasjon.navn}: ${formaterKontonummer(
            kontoinformasjon?.kontonummer
          )}`}</SkjemaAlert>
        )}
      </Box>
    </>
  )
}
