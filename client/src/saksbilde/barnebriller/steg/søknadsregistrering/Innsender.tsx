import { useState } from 'react'
import { useParams } from 'react-router'

import { Button, TextField } from '@navikt/ds-react'

import { IKKE_FUNNET } from '../../../../io/http'
import { formaterKontonummer } from '../../../../utils/stringFormating'

import { Kolonner } from '../../../../felleskomponenter/Kolonner'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { useKontonummer } from './useKontonummer'

export const Innsender = () => {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const [textFieldValue, setTextFieldValue] = useState('')
  const [innsenderFnr, setInnsenderFnr] = useState('')
  const { data: kontoinformasjon, error, loading } = useKontonummer(saksnummer!, innsenderFnr)

  return (
    <>
      <Kolonner>
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
      </Kolonner>
      {error?.status === IKKE_FUNNET && (
        <SkjemaAlert variant="error">
          {`Fant ikke kontonummer for ${innsenderFnr}. Kontakt personen og be dem legge inn kontonummer hos NAV.`}
        </SkjemaAlert>
      )}

      {error?.status && error.status !== IKKE_FUNNET && (
        <SkjemaAlert variant="error">
          {`Klarte ikke å hente kontonummer for ${innsenderFnr}. Prøv igjen om noen minutter. Hvis problemet ikke løser seg, kontakt DigiHoT.`}
        </SkjemaAlert>
      )}
      {kontoinformasjon && (
        <SkjemaAlert variant="info">{`Kontonummer for ${kontoinformasjon?.kontohaver}: ${formaterKontonummer(
          kontoinformasjon?.kontonummer
        )}`}</SkjemaAlert>
      )}
    </>
  )
}
