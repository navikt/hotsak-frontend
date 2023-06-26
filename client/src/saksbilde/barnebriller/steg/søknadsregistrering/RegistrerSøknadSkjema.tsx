//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import 'date-fns'
import { formatISO } from 'date-fns'
import React, { useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { Button, Heading, Loader } from '@navikt/ds-react'

import { postVilkårsvurdering, putSendTilGosys } from '../../../../io/http'
import { Dokumenter } from '../../../../oppgaveliste/manuellJournalføring/Dokumenter'
import { toDate } from '../../../../utils/date'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../../felleskomponenter/Button'
import { Tekstfelt } from '../../../../felleskomponenter/skjema/Tekstfelt'
import {
  MålformType,
  OverforGosysTilbakemelding,
  RegistrerSøknadData,
  StegType,
  VurderVilkårRequest,
} from '../../../../types/types.internal'
import { OverførGosysModal } from '../../../OverførGosysModal'
import { useJournalposter } from '../../../journalpostHook'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { Utbetalingsmottaker } from './Utbetalingsmottaker'
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
  const { saksnummer: sakId } = useParams<{ saksnummer: string }>()
  const { sak, isLoading, isError, mutate } = useBrillesak()
  const { setValgtTab } = useManuellSaksbehandlingContext()
  const [venterPåVilkårsvurdering, setVenterPåVilkårsvurdering] = useState(false)
  const { showBoundary } = useErrorBoundary()
  const [visGosysModal, setVisGosysModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const { dokumenter } = useJournalposter()

  const vurderVilkår = (formData: RegistrerSøknadData) => {
    const { bestillingsdato, ...rest } = { ...formData }

    const vurderVilkårRequest: VurderVilkårRequest = {
      sakId: sakId!,
      bestillingsdato: formatISO(bestillingsdato, { representation: 'date' }),
      ...rest,
    }

    setVenterPåVilkårsvurdering(true)
    postVilkårsvurdering(vurderVilkårRequest)
      .catch(() => setVenterPåVilkårsvurdering(false))
      .then(() => {
        setValgtTab(StegType.VURDERE_VILKÅR)
        mutate()
        setVenterPåVilkårsvurdering(false)
      })
  }

  const sendTilGosys = (tilbakemelding: OverforGosysTilbakemelding) => {
    setLoading(true)
    putSendTilGosys(sakId!, tilbakemelding)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisGosysModal(false)
        mutate(`api/sak/${sakId}`)
        mutate(`api/sak/${sakId}/historikk`)
      })
  }

  const methods = useForm<RegistrerSøknadData>({
    defaultValues: {
      målform: sak?.data.vilkårsgrunnlag?.målform || MålformType.BOKMÅL,
      bestillingsdato: toDate(sak?.data.vilkårsgrunnlag?.bestillingsdato),
      brilleseddel: {
        høyreSfære: sak?.data.vilkårsgrunnlag?.brilleseddel.høyreSfære.toString() || '',
        høyreSylinder: sak?.data.vilkårsgrunnlag?.brilleseddel.høyreSylinder.toString() || '',
        venstreSfære: sak?.data.vilkårsgrunnlag?.brilleseddel.venstreSfære.toString() || '',
        venstreSylinder: sak?.data.vilkårsgrunnlag?.brilleseddel.venstreSylinder.toString() || '',
      },
      brillepris: sak?.data.vilkårsgrunnlag?.brillepris || '',
      bestiltHosOptiker: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.bestiltHosOptiker.vilkårOppfylt || '',
        begrunnelse: sak?.data.vilkårsgrunnlag?.bestiltHosOptiker.begrunnelse || '',
      },
      komplettBrille: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.komplettBrille.vilkårOppfylt || '',
        begrunnelse: sak?.data.vilkårsgrunnlag?.komplettBrille.begrunnelse || '',
      },
    },
  })

  const {
    formState: { errors },
  } = methods

  if (isLoading) {
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
      <Dokumenter dokumenter={dokumenter} />
      <Avstand paddingTop={4} paddingLeft={2}>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) => {
              vurderVilkår(data)
            })}
            autoComplete="off"
          >
            <Målform />
            <Avstand paddingTop={6}>
              <Utbetalingsmottaker defaultInnsenderFnr={sak?.data.utbetalingsmottaker?.fnr} />
            </Avstand>
            <Avstand paddingTop={4}>
              <Bestillingsdato />
            </Avstand>
            <Avstand paddingTop={4}>
              <Tekstfelt
                id="brillepris"
                label="Pris på brillen"
                description="Skal bare inkludere glass, slip av glass og innfatning, inkl moms, og brilletilpasning. Eventuell synsundersøkelse skal ikke inkluderes i prisen."
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
              <Knappepanel>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  disabled={venterPåVilkårsvurdering}
                  loading={venterPåVilkårsvurdering}
                >
                  Neste
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => setVisGosysModal(true)}
                  data-cy="btn-vis-gosys-modal"
                >
                  Overfør til Gosys
                </Button>
              </Knappepanel>
            </Avstand>
          </form>
        </FormProvider>
      </Avstand>
      <OverførGosysModal
        open={visGosysModal}
        loading={loading}
        årsaker={overforGosysArsaker}
        legend="Hvorfor vil du overføre saken?"
        onBekreft={(tilbakemelding) => {
          sendTilGosys(tilbakemelding)
        }}
        onClose={() => setVisGosysModal(false)}
      />
    </Container>
  )
}

const overforGosysArsaker: ReadonlyArray<string> = [
  'Behandlingsbriller/linser ordinære vilkår',
  'Behandlingsbriller/linser særskilte vilkår',
  'Annet',
]
