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
import {
  Brevkode,
  Brilleseddel,
  MålformType,
  OppgaveStatusType,
  Oppgavetype,
  OverforGosysTilbakemelding,
  RegistrerSøknadData,
  StegType,
} from '../../../../types/types.internal'
import { OverførGosysModal } from '../../../OverførGosysModal'
import { useJournalposter } from '../../../journalpostHook'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { useSaksdokumenter } from '../../useSaksdokumenter'
import { RegistrerBrillegrunnlag } from './RegistrerBrillegrunnlag'
import { Målform } from './skjemaelementer/Målform'

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
  const sendteBrev = []
  const sakStatus = sak?.data.status
  const antallJournalposter = new Set(dokumenter.map((dokument) => dokument.journalpostID)).size

  const kanHaEtterspørreOpplysningerBrev: boolean =
    sakStatus === OppgaveStatusType.AVVENTER_DOKUMENTASJON || antallJournalposter > 1

  const toggleAvEtterspørreOpplysninger = window.appSettings.MILJO === 'prod-gcp'

  const { data: saksdokumenter } = useSaksdokumenter(
    sakId!,
    toggleAvEtterspørreOpplysninger ? false : kanHaEtterspørreOpplysningerBrev
  )

  /*const etterspørreOpplysningerBrev = saksdokumenter?.find(
    (saksokument) => saksokument.brevkode === Brevkode.INNHENTE_OPPLYSNINGER_BARNEBRILLER
  )*/

  /*const etterspørreOpplysningerBrevFinnes = toggleAvEtterspørreOpplysninger
    ? false
    : etterspørreOpplysningerBrev !== undefined*/

  const vurderVilkår = (formData: RegistrerSøknadData) => {
    const { /*opplysningsplikt,*/ målform, ...grunnlag } = { ...formData }

    //let vurderVilkårRequest

    /* if (opplysningsplikt.vilkårOppfylt === VilkårsResultat.NEI) {
      vurderVilkårRequest = {
        sakId: sakId!,
        sakstype: Oppgavetype.BARNEBRILLER,
        //opplysningsplikt: opplysningsplikt,
        målform: målform,
        data: undefined,
      }
    } else {*/
    const { bestillingsdato, brilleseddel, ...rest } = { ...grunnlag }

    const vurderVilkårRequest = {
      sakId: sakId!,
      sakstype: Oppgavetype.BARNEBRILLER,
      /*opplysningsplikt: {
          vilkårOppfylt: VilkårsResultat.JA,
          begrunnelse: '',
        },*/
      målform: målform,
      data: {
        bestillingsdato: bestillingsdato ? formatISO(bestillingsdato, { representation: 'date' }) : undefined,
        brilleseddel: !tomBrilleseddel(brilleseddel) ? brilleseddel : undefined,
        ...rest,
      },
    }
    //}

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
      /*opplysningsplikt: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.opplysningsplikt.vilkårOppfylt || '',
        begrunnelse: '',
      },*/
      bestillingsdato: toDate(sak?.data.vilkårsgrunnlag?.data?.bestillingsdato),
      brilleseddel: {
        høyreSfære: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.høyreSfære.toString() || '',
        høyreSylinder: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.høyreSylinder.toString() || '',
        venstreSfære: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.venstreSfære.toString() || '',
        venstreSylinder: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.venstreSylinder.toString() || '',
      },
      brillepris: sak?.data.vilkårsgrunnlag?.data?.brillepris || '',
      bestiltHosOptiker: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.data?.bestiltHosOptiker.vilkårOppfylt,
        begrunnelse: sak?.data.vilkårsgrunnlag?.data?.bestiltHosOptiker.begrunnelse || '',
      },
      komplettBrille: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.data?.komplettBrille.vilkårOppfylt,
        begrunnelse: sak?.data.vilkårsgrunnlag?.data?.komplettBrille.begrunnelse || '',
      },
    },
  })

  const {
    formState: { errors },
    watch,
  } = methods

  if (isLoading) {
    return (
      <div>
        <Loader />
        Henter sak...
      </div>
    )
  }

  //const opplysningsplikt = watch('opplysningsplikt')

  /* const skjulSkjemaFelter = toggleAvEtterspørreOpplysninger
    ? false
    : etterspørreOpplysningerBrevFinnes &&
      (opplysningsplikt.vilkårOppfylt === VilkårsResultat.NEI || opplysningsplikt.vilkårOppfylt === '')*/

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
            {/*etterspørreOpplysningerBrevFinnes && (
              <Opplysningsplikt brevSendtDato={etterspørreOpplysningerBrev!.opprettet} />
            )*/}
            {/*!skjulSkjemaFelter &&**/ <RegistrerBrillegrunnlag />}

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
