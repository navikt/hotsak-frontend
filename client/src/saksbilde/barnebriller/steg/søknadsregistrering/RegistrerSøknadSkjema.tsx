import 'date-fns'
import { formatISO } from 'date-fns'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { Button, Heading, Loader } from '@navikt/ds-react'

import { postVilkårsvurdering } from '../../../../io/http'
import { Dokumenter } from '../../../../oppgaveliste/manuellJournalføring/Dokumenter'
import { toDate } from '../../../../utils/date'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../../felleskomponenter/Button'
import { Brilleseddel, MålformType, Oppgavetype, RegistrerSøknadData, StegType } from '../../../../types/types.internal'
import { useJournalposter } from '../../../journalpostHook'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { RegistrerBrillegrunnlag } from './RegistrerBrillegrunnlag'
import { Målform } from './skjemaelementer/Målform'

const Container = styled.div`
  overflow: auto;
  padding-top: var(--a-spacing-6);
`

export const RegistrerSøknadSkjema: React.FC = () => {
  const { saksnummer: sakId } = useParams<{ saksnummer: string }>()
  const { sak, isLoading, mutate } = useBrillesak()
  const { setValgtTab } = useManuellSaksbehandlingContext()
  const [venterPåVilkårsvurdering, setVenterPåVilkårsvurdering] = useState(false)
  const { dokumenter } = useJournalposter()

  const vurderVilkår = (formData: RegistrerSøknadData) => {
    const { målform, ...grunnlag } = { ...formData }
    const { bestillingsdato, brilleseddel, ...rest } = { ...grunnlag }

    const vurderVilkårRequest = {
      sakId: sakId!,
      sakstype: Oppgavetype.BARNEBRILLER,
      målform: målform,
      data: {
        bestillingsdato: bestillingsdato ? formatISO(bestillingsdato, { representation: 'date' }) : undefined,
        brilleseddel: !tomBrilleseddel(brilleseddel) ? brilleseddel : undefined,
        ...rest,
      },
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

  function tomBrilleseddel(brilleseddel?: Brilleseddel) {
    if (!brilleseddel) {
      return true
    }

    const { høyreSfære, høyreSylinder, venstreSfære, venstreSylinder } = brilleseddel
    return høyreSfære === '' && høyreSylinder === '' && venstreSfære === '' && venstreSylinder === ''
  }

  const methods = useForm<RegistrerSøknadData>({
    defaultValues: {
      målform: sak?.data.vilkårsgrunnlag?.målform || MålformType.BOKMÅL,
      bestillingsdato: toDate(sak?.data.vilkårsgrunnlag?.data?.bestillingsdato),
      brilleseddel: {
        høyreSfære: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.høyreSfære.toString() || '',
        høyreSylinder: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.høyreSylinder.toString() || '',
        venstreSfære: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.venstreSfære.toString() || '',
        venstreSylinder: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.venstreSylinder.toString() || '',
      },
      brillepris: sak?.data.vilkårsgrunnlag?.data?.brillepris || '',
      bestiltHosOptiker: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.data?.bestiltHosOptiker.vilkårOppfylt || '',
        begrunnelse: sak?.data.vilkårsgrunnlag?.data?.bestiltHosOptiker.begrunnelse || '',
      },
      komplettBrille: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.data?.komplettBrille.vilkårOppfylt || '',
        begrunnelse: sak?.data.vilkårsgrunnlag?.data?.komplettBrille.begrunnelse || '',
      },
    },
  })

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
      <Avstand marginTop={4}>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) => {
              vurderVilkår(data)
            })}
            autoComplete="off"
          >
            <Målform />
            <RegistrerBrillegrunnlag />
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
            </Knappepanel>
          </form>
        </FormProvider>
      </Avstand>
    </Container>
  )
}
