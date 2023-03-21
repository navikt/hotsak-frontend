import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'

import { Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { baseUrl, put } from '../../../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../../../utils/amplitude'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { useInnloggetSaksbehandler } from '../../../../state/authentication'
import { StegType, TotrinnsKontrollData, TotrinnsKontrollVurdering } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { GodkjenneTotrinnskontrollModal } from './GodkjenneTotrinnskontrollModal'

export const TotrinnskontrollForm: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { mutate } = useSWRConfig()
  const [visGodkjenningsModal, setVisGodkjenningsModal] = useState(false)
  const saksbehandler = useInnloggetSaksbehandler()
  const { sak } = useBrillesak()

  const methods = useForm<TotrinnsKontrollData>({
    defaultValues: {
      resultat: '',
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

  const resultat = watch('resultat')

  const lagreTotrinnskontroll = () => {
    const formData = getValues()

    setLoading(true)
    put(`${baseUrl}/api/sak/${sak!.sakId}/kontroll`, formData)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        mutate(`api/sak/${sak!.sakId}`)
        mutate(`api/sak/${sak!.sakId}/historikk`)
      })
  }

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(() => {
            if (resultat === TotrinnsKontrollVurdering.GODKJENT) {
              setVisGodkjenningsModal(true)
            } else {
              lagreTotrinnskontroll()
            }
          })}
        >
          <Controller
            name="resultat"
            control={control}
            rules={{ required: 'Velg en verdi' }}
            render={({ field }) => (
              <RadioGroup legend="Du må gjøre en vurdering" size="small" {...field} error={errors.resultat?.message}>
                <Radio value={TotrinnsKontrollVurdering.GODKJENT}>Godkjenn</Radio>
                <Radio value={TotrinnsKontrollVurdering.RETURNERT}>Returner til saksbehandler</Radio>
              </RadioGroup>
            )}
          />

          {resultat === TotrinnsKontrollVurdering.RETURNERT && (
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
            {
              /*totrinnkontrollMulig &&*/ <Button variant="primary" type="submit" size="small" loading={loading}>
                {resultat === TotrinnsKontrollVurdering.GODKJENT ? 'Godkjenn vedtaket' : 'Returner saken'}
              </Button>
            }
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
    </>
  )
}
