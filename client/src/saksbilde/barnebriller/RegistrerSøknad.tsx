//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { register } from 'fetch-intercept'
import { useEffect, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import {
  Button,
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
import { Tekstfelt } from '../../felleskomponenter/skjema/Tekstfelt'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { RegistrerSøknadData } from '../../types/types.internal'
import { useBrillesak } from '../sakHook'
import { Bestillingsdato } from './skjemaelementer/Bestillingsdato'
import { Målform } from './skjemaelementer/Målform'
import { Øye } from './skjemaelementer/Øye'

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

  const methods = useForm<RegistrerSøknadData>({
    defaultValues: {
      maalform: '',
      bestillingsdato: '',
      brillestyrke: {
        høyreSfære: '',
        høyreSylinder: '',
        venstreSfære: '',
        venstreSylinder: '',
      },
      brillepris: '',
    },
  })

  if (isLoading || !journalpost) {
    return (
      <div>
        <Loader />
        Henter sak...
      </div>
    )
  }

  console.log('aa', methods.watch())

  return (
    <Container>
      <Heading level="1" size="xsmall" spacing>
        Registrer søknad
      </Heading>
      <Dokumenter journalpostID={journalpost.journalpostID} />
      <Avstand paddingTop={4} paddingLeft={2}>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) => {
              console.log('Data', data)
            })}
          >
            <Målform />

            <Avstand paddingTop={4}>
              <Bestillingsdato />
            </Avstand>
            <Avstand paddingTop={4}>
              <Tekstfelt
                id="brillepris"
                label="Pris på brillen"
                description="Skal bare inkludere glass, slip av glass og innfatning, inkl moms, og tilpasning."
                size="small"
                {...methods.register('brillepris')}
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
        </FormProvider>
      </Avstand>
    </Container>
  )
}
