import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Button, Panel, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { baseUrl, put } from '../../../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../../../utils/amplitude'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { useInnloggetSaksbehandler } from '../../../../state/authentication'
import { StegType, TotrinnsKontrollData, TotrinnsKontrollVurdering } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { GodkjenneTotrinnskontrollModal } from './GodkjenneTotrinnskontrollModal'

export const TotrinnskontrollPanel: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [visGodkjenningsModal, setVisGodkjenningsModal] = useState(false)
  const saksbehandler = useInnloggetSaksbehandler()
  const { sak, isError, isLoading, mutate } = useBrillesak()

  const methods = useForm<TotrinnsKontrollData>({
    defaultValues: {
      vurdering: '',
      begrunnelse: '',
    },
  })

  const {
    control,
    watch,
    formState: { errors },
    handleSubmit,
    getValues,
  } = methods

  const vurdering = watch('vurdering')

  /* const lagreTotrinnskontroll = (sakID: string, data: TotrinnsKontrollData) => {
    setLoading(true)
    put(`${baseUrl}/api/sak/${sakID}/kontroll`, data)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        mutate(`api/sak/${sakID}`)
        mutate(`api/sak/${sakID}/historikk`)
      })
  }*/

  const lagreTotrinnskontroll = () => {
    const formData = getValues()
    //console.log("Kaller handle submit", getValues());
    //lagreTotrinnskontroll(sak!.sakId, data)

    setLoading(true)
    put(`${baseUrl}/api/sak/${sak!.sakId}/kontroll`, formData)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        mutate(`api/sak/${sak!.sakId}`)
        mutate(`api/sak/${sak!.sakId}/historikk`)
      })
  }

  if (isError || !sak) {
    return <div>Feil ved henting av sak</div>
  }

  if (
    sak.steg !== StegType.GODKJENNE ||
    (sak.saksbehandler && sak?.saksbehandler.objectId !== saksbehandler.objectId)
  ) {
    return <div>Lesevisning eller tomt resultat hvis ingen totrinnskontroll enda</div>
  }

  return (
    <Container>
      <Etikett>TOTRINNSKONTROLL</Etikett>
      <Avstand paddingTop={4} />
      <Brødtekst>Kontrollér opplysninger og faglige vurderinger som er gjort</Brødtekst>
      <Avstand paddingTop={6} />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(() => {
            if (vurdering === TotrinnsKontrollVurdering.GODKJENT) {
              setVisGodkjenningsModal(true)
            } else {
              lagreTotrinnskontroll()
            }
          })}
        >
          <Controller
            name="vurdering"
            control={control}
            rules={{ required: 'Velg en verdi' }}
            render={({ field }) => (
              <RadioGroup legend="Du må gjøre en vurdering" size="small" {...field} error={errors.vurdering?.message}>
                <Radio value={TotrinnsKontrollVurdering.GODKJENT}>Godkjenn</Radio>
                <Radio value={TotrinnsKontrollVurdering.RETURNERT}>Returner til saksbehandler</Radio>
              </RadioGroup>
            )}
          />

          {vurdering === TotrinnsKontrollVurdering.RETURNERT && (
            <Avstand paddingTop={4}>
              <Textarea
                size="small"
                label="Begrunn vurderingen din"
                description="Skriv hvorfor saken returneres, så det er enkelt å forstå hva som vurderes og gjøres om."
                error={errors.begrunnelse?.message}
                {...methods.register('begrunnelse', { required: 'Du må begrunne vurderingen din ' })}
              ></Textarea>
            </Avstand>
          )}

          <Avstand paddingTop={4}>
            <Button variant="primary" type="submit" size="small" loading={loading}>
              {vurdering === TotrinnsKontrollVurdering.GODKJENT ? 'Godkjenn vedtaket' : 'Returner saken'}
            </Button>
          </Avstand>
        </form>
      </FormProvider>

      <GodkjenneTotrinnskontrollModal
        open={visGodkjenningsModal}
        onBekreft={() => {
          lagreTotrinnskontroll()
          logAmplitudeEvent(amplitude_taxonomy.TOTRINNSKONTROLL_GODKJENT)
        }}
        loading={loading}
        onClose={() => {
          errors
          setVisGodkjenningsModal(false)
        }}
      />
    </Container>
  )
}

const Container = styled(Panel)`
  border-left: 1px solid var(--a-border-default);
  min-height: 100vh;
`
