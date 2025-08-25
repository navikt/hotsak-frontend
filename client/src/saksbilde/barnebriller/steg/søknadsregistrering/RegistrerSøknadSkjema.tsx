import { Box, Button, Loader } from '@navikt/ds-react'
import { formatISO } from 'date-fns'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Dokumenter } from '../../../../dokument/Dokumenter'
import { Knappepanel } from '../../../../felleskomponenter/Knappepanel'
import { postVilkårsvurdering } from '../../../../io/http'
import {
  Brilleseddel,
  MålformType,
  RegistrerSøknadData,
  Sakstype,
  StepType,
  VilkårsResultat,
} from '../../../../types/types.internal'
import { tilDato } from '../../../../utils/dato'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { useJournalposter } from '../../../useJournalposter'
import { useSakId } from '../../../useSak.ts'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { RegistrerBrillegrunnlag } from './RegistrerBrillegrunnlag'
import { Målform } from './skjemaelementer/Målform'

const Container = styled.div`
  overflow: auto;
`

export function RegistrerSøknadSkjema() {
  const sakId = useSakId()
  const { sak, isLoading, mutate } = useBarnebrillesak()
  const { setStep } = useManuellSaksbehandlingContext()
  const [venterPåVilkårsvurdering, setVenterPåVilkårsvurdering] = useState(false)
  const { dokumenter } = useJournalposter()

  const vurderVilkår = (formData: RegistrerSøknadData) => {
    const { målform, ...grunnlag } = { ...formData }
    const { bestillingsdato, brilleseddel, kjøptBrille, ...rest } = { ...grunnlag }

    const vurderVilkårRequest = {
      sakId: sakId!,
      sakstype: Sakstype.BARNEBRILLER,
      målform: målform,
      data: {
        bestillingsdato: bestillingsdato ? formatISO(bestillingsdato, { representation: 'date' }) : undefined,
        brillepris: kjøptBrille.brillepris.replace(',', '.'),
        brilleseddel: !tomBrilleseddel(brilleseddel) ? brilleseddel : undefined,
        kjøptBrille: {
          vilkårOppfylt: kjøptBrille.vilkårOppfylt,
        },
        ...rest,
      },
    }

    setVenterPåVilkårsvurdering(true)
    postVilkårsvurdering(vurderVilkårRequest)
      .catch(() => setVenterPåVilkårsvurdering(false))
      .then(async () => {
        await mutate()
        setStep(StepType.VILKÅR)
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
      bestillingsdato: tilDato(sak?.data.vilkårsgrunnlag?.data?.bestillingsdato),
      brilleseddel: {
        høyreSfære: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.høyreSfære.toString() || '',
        høyreSylinder: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.høyreSylinder.toString() || '',
        venstreSfære: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.venstreSfære.toString() || '',
        venstreSylinder: sak?.data.vilkårsgrunnlag?.data?.brilleseddel?.venstreSylinder.toString() || '',
      },

      bestiltHosOptiker: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.data?.bestiltHosOptiker.vilkårOppfylt || '',
        begrunnelse: sak?.data.vilkårsgrunnlag?.data?.bestiltHosOptiker.begrunnelse || '',
      },
      komplettBrille: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.data?.komplettBrille.vilkårOppfylt || '',
        begrunnelse: sak?.data.vilkårsgrunnlag?.data?.komplettBrille.begrunnelse || '',
      },
      kjøptBrille: {
        vilkårOppfylt: sak?.data.vilkårsgrunnlag?.data.kjøptBrille?.vilkårOppfylt || VilkårsResultat.JA,
        brillepris: sak?.data.vilkårsgrunnlag?.data?.brillepris?.toString()?.replace('.', ',') || '',
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
      <Box paddingBlock="4 2">
        <Dokumenter dokumenter={dokumenter} />
      </Box>
      <Box marginBlock="10 0" paddingInline="2">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) => {
              vurderVilkår(data)
            })}
            autoComplete="off"
          >
            <Målform />
            <RegistrerBrillegrunnlag />
            <Knappepanel marginBlock={'space-40'}>
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
      </Box>
    </Container>
  )
}
