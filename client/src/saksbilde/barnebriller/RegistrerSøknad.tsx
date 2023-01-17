//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import {
  Button,
  CheckboxGroup,
  Heading,
  Loader,
  Radio,
  RadioGroup,
  Textarea,
  TextField,
  UNSAFE_DatePicker,
  UNSAFE_useDatepicker,
} from '@navikt/ds-react'

import { useDokument } from '../../oppgaveliste/dokumenter/dokumentHook'
import { Dokumenter } from '../../oppgaveliste/manuellJournalføring/Dokumenter'

import { Avstand } from '../../felleskomponenter/Avstand'
import { ButtonContainer } from '../../felleskomponenter/Dialogboks'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { useBrillesak } from '../sakHook'
import { Øye } from './Øye'

const Container = styled.div`
  overflow: auto;
  padding-top: var(--a-spacing-6);
`

const Kolonner = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  align-self: flex-end;
  align-items: flex-end;
`

export const RegistrerSøknad: React.FC = () => {
  const navigate = useNavigate()
  const { sak, isLoading, isError } = useBrillesak()
  const { journalpost, /*isError,*/ isLoading: henterJournalpost } = useDokument(sak?.journalpost[0])
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const { isLoading: henterPerson, personInfo } = usePersonInfo(fodselsnummer)
  const [error, setError] = useState('')
  //const [journalfører, setJournalfører] = useState(false)
  const handleError = useErrorHandler()

  console.log(`Sak jp ${sak?.journalpost}`)

  const { datepickerProps, inputProps, selectedDay } = UNSAFE_useDatepicker({
    fromDate: new Date('Aug 1 2022'),
    onDateChange: console.log,
  })

  if (isLoading || !journalpost) {
    return (
      <div>
        <Loader />
        Henter sak...
      </div>
    )
  }

  return (
    <Container>
      <Heading level="1" size="xsmall" spacing>
        Registrer søknad
      </Heading>
      <Dokumenter journalpostID={journalpost.journalpostID} />
      <Avstand paddingTop={4}></Avstand>

      <form>
        <RadioGroup legend="Målform" size="small" value="bokmål">
          <Radio value="bokmål">Bokmål</Radio>
          <Radio value="nynorsk">Nynorsk</Radio>
        </RadioGroup>
        <Avstand paddingTop={4}>
          <UNSAFE_DatePicker {...datepickerProps}>
            <UNSAFE_DatePicker.Input {...inputProps} label="Bestillingsdato" />
          </UNSAFE_DatePicker>
        </Avstand>
        <Avstand paddingTop={4}>
          <TextField
            label="Pris på brillen"
            description="Skal bare inkludere glass, slip av glass og innfatning, inkl moms, og tilpasning."
            size="small"
          />
        </Avstand>

        <Avstand paddingTop={4}>
          <Heading level="2" size="xsmall" spacing>
            § 2 Brillestyrke
          </Heading>
          <Øye type="høyre" />
          <Øye type="venstre" />
        </Avstand>

        <Avstand paddingTop={6}>
          <Heading level="2" size="xsmall" spacing>
            § 2 Brillen må være bestilt hos optiker
          </Heading>
          <RadioGroup legend="Er brillen bestilt hos optiker" size="small" value="ja">
            <Radio value="ja">Ja</Radio>
            <Radio value="nei">Nei</Radio>
            <Radio value="manglerDokumentasjon">Dokumentasjon mangler</Radio>
          </RadioGroup>
        </Avstand>

        <Avstand paddingTop={4}>
          <Heading level="2" size="xsmall" spacing>
            § 2 Komplett brille
          </Heading>
          <RadioGroup legend="Er det en komplett brille?" size="small" value="ja">
            <Radio value="ja">Ja</Radio>
            <Radio value="nei">Nei</Radio>
            <Radio value="manglerDokumentasjon">Dokumentasjon mangler</Radio>
          </RadioGroup>
        </Avstand>
        <Avstand paddingTop={4}>
          <Textarea size="small" label="Begrunnelse" description="Skriv din individuelle begrunnelse"></Textarea>
        </Avstand>

        {/* <Avstand paddingTop={6}>
          <Dokumenter />
  </Avstand>*/}
        <Avstand paddingLeft={2}>
          <ButtonContainer>
            <Button
              type="submit"
              variant="primary"
              size="small"
              //disabled={journalfører}
              //loading={journalfører}
            >
              Neste steg
            </Button>
          </ButtonContainer>
        </Avstand>
      </form>
    </Container>
  )
}
