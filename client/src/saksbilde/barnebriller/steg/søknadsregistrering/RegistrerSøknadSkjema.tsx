//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { formatISO } from 'date-fns'
import { useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { Button, Heading, Loader } from '@navikt/ds-react'

import { postVilkårsvurdering } from '../../../../io/http'
import { useDokument } from '../../../../oppgaveliste/dokumenter/dokumentHook'
import { Dokumenter } from '../../../../oppgaveliste/manuellJournalføring/Dokumenter'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { ButtonContainer } from '../../../../felleskomponenter/Dialogboks'
import { Tekstfelt } from '../../../../felleskomponenter/skjema/Tekstfelt'
import { MålformType, RegistrerSøknadData, VurderVilkårRequest } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { Bestillingsdato } from './skjemaelementer/Bestillingsdato'
import { BestiltHosOptiker } from './skjemaelementer/BestiltHosOptiker'
import { BrillestyrkeForm } from './skjemaelementer/BrillestyrkeForm'
import { KomplettBrille } from './skjemaelementer/KomplettBrille'
import { Målform } from './skjemaelementer/Målform'
import { validator, validering } from './skjemaelementer/validering/validering'

const Container = styled.div`
  overflow: auto;
  padding-top: var(--a-spacing-6);
`

export const RegistrerSøknadSkjema: React.FC = () => {
  const { saksnummer: sakID } = useParams<{ saksnummer: string }>()
  const { sak, isLoading, isError, mutate } = useBrillesak()
  const { journalpost, /*isError,*/ isLoading: henterJournalpost } = useDokument(sak?.journalposter[0])
  const [venterPåVilkårsvurdering, setVenterPåVilkårsvurdering] = useState(false)
  const handleError = useErrorHandler()

  const vurderVilkår = (formData: RegistrerSøknadData) => {
    const { bestillingsdato, ...rest } = { ...formData }

    const vurderVilkårRequest: VurderVilkårRequest = {
      sakId: sakID!,
      bestillingsdato: formatISO(bestillingsdato, { representation: 'date' }),
      ...rest,
    }

    setVenterPåVilkårsvurdering(true)
    postVilkårsvurdering(vurderVilkårRequest)
      .catch(() => setVenterPåVilkårsvurdering(false))
      .then(() => {
        mutate()
        setVenterPåVilkårsvurdering(false)
      })
  }

  const methods = useForm<RegistrerSøknadData>({
    defaultValues: {
      målform: sak?.vilkårsgrunnlag?.målform || MålformType.BOKMÅL,
      bestillingsdato: sak?.vilkårsgrunnlag?.bestillingsdato || undefined,
      brilleseddel: {
        høyreSfære: sak?.vilkårsgrunnlag?.brilleseddel.høyreSfære || '',
        høyreSylinder: sak?.vilkårsgrunnlag?.brilleseddel.høyreSylinder || '',
        venstreSfære: sak?.vilkårsgrunnlag?.brilleseddel.venstreSfære || '',
        venstreSylinder: sak?.vilkårsgrunnlag?.brilleseddel.venstreSylinder || '',
      },
      brillepris: sak?.vilkårsgrunnlag?.brillepris || '',
      bestiltHosOptiker: {
        vilkårOppfylt: sak?.vilkårsgrunnlag?.bestiltHosOptiker.vilkårOppfylt || '',
        begrunnelse: sak?.vilkårsgrunnlag?.bestiltHosOptiker.begrunnelse || '',
      },
      komplettBrille: {
        vilkårOppfylt: sak?.vilkårsgrunnlag?.komplettBrille.vilkårOppfylt || '',
        begrunnelse: sak?.vilkårsgrunnlag?.komplettBrille.begrunnelse || '',
      },
    },
  })

  const {
    formState: { errors },
  } = methods

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
            autoComplete="off"
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
                error={errors.brillepris?.message}
                size="small"
                {...methods.register('brillepris', {
                  required: 'Du må oppgi en brillepris',
                  validate: validator(validering.beløp, 'Ugyldig brillepris'),
                })}
              />
            </Avstand>
            <BrillestyrkeForm />
            <KomplettBrille />
            <BestiltHosOptiker />
            <Avstand paddingLeft={2}>
              <ButtonContainer>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  disabled={venterPåVilkårsvurdering}
                  loading={venterPåVilkårsvurdering}
                >
                  Vurder vilkår
                </Button>
              </ButtonContainer>
            </Avstand>
          </form>
        </FormProvider>
      </Avstand>
    </Container>
  )
}
