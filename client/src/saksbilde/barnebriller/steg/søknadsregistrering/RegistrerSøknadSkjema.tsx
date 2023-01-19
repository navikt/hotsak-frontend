//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { Button, Heading, Loader, Textarea } from '@navikt/ds-react'

import { postVilkårsvurdering } from '../../../../io/http'
import { useDokument } from '../../../../oppgaveliste/dokumenter/dokumentHook'
import { Dokumenter } from '../../../../oppgaveliste/manuellJournalføring/Dokumenter'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { ButtonContainer } from '../../../../felleskomponenter/Dialogboks'
import { Tekstfelt } from '../../../../felleskomponenter/skjema/Tekstfelt'
import { usePersonContext } from '../../../../personoversikt/PersonContext'
import { usePersonInfo } from '../../../../personoversikt/personInfoHook'
import { MålformType, RegistrerSøknadData, VurderVilkårRequest } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { Bestillingsdato } from '../../skjemaelementer/Bestillingsdato'
import { BestiltHosOptiker } from '../../skjemaelementer/BestiltHotOptiker'
import { KomplettBrille } from '../../skjemaelementer/KomplettBrille'
import { Målform } from '../../skjemaelementer/Målform'
import { Øye } from '../../skjemaelementer/Øye'

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

export const RegistrerSøknadSkjema: React.FC = () => {
  const navigate = useNavigate()
  const { saksnummer: sakID } = useParams<{ saksnummer: string }>()
  const { sak, isLoading, isError, mutate } = useBrillesak()
  const { journalpost, /*isError,*/ isLoading: henterJournalpost } = useDokument(sak?.journalpost[0])
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const { isLoading: henterPerson, personInfo } = usePersonInfo(fodselsnummer)
  const [error, setError] = useState('')
  const [venterPåVilkårsvurdering, setVenterPåVilkårsvurdering] = useState(false)
  const handleError = useErrorHandler()

  const vurderVilkår = (formData: RegistrerSøknadData) => {
    const vurderVilkårRequest: VurderVilkårRequest = {
      sakId: sakID!,
      ...formData,
    }

    setVenterPåVilkårsvurdering(true)
    postVilkårsvurdering(vurderVilkårRequest)
      .catch(() => setVenterPåVilkårsvurdering(false))
      .then(() => {
        setVenterPåVilkårsvurdering(false)
        mutate()
      })
  }

  const methods = useForm<RegistrerSøknadData>({
    defaultValues: {
      maalform: MålformType.BOKMÅL,
      bestillingsdato: '',
      brillestyrke: {
        høyreSfære: '',
        høyreSylinder: '',
        venstreSfære: '',
        venstreSylinder: '',
      },
      brillepris: '',
      bestiltHosOptiker: '',
      komplettBrille: '',
      saksbehandlersBegrunnelse: '',
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
              vurderVilkår(data)
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
              <KomplettBrille />
            </Avstand>

            <Avstand paddingTop={4}>
              <BestiltHosOptiker />
            </Avstand>
            <Avstand paddingTop={4}>
              <Textarea
                size="small"
                label="Begrunnelse"
                description="Skriv din individuelle begrunnelse"
                {...methods.register('saksbehandlersBegrunnelse')}
              ></Textarea>
            </Avstand>

            <Avstand paddingLeft={2}>
              <ButtonContainer>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  disabled={venterPåVilkårsvurdering}
                  loading={venterPåVilkårsvurdering}
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
