import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'

import { Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { baseUrl, put } from '../../../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../../../utils/amplitude'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Brødtekst } from '../../../../felleskomponenter/typografi'
import { useInnloggetSaksbehandler } from '../../../../state/authentication'
import { StegType, TotrinnskontrollData, TotrinnskontrollVurdering } from '../../../../types/types.internal'
import { BekreftelsesModal } from '../../../komponenter/BekreftelsesModal'
import { useBrillesak } from '../../../sakHook'

export const TotrinnskontrollForm: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { mutate } = useSWRConfig()
  const [visGodkjenningsModal, setVisGodkjenningsModal] = useState(false)
  const saksbehandler = useInnloggetSaksbehandler()
  const { sak } = useBrillesak()
  const methods = useForm<TotrinnskontrollData>({
    defaultValues: {
      resultat: '',
      begrunnelse: '',
    },
  })

  const {
    control,
    watch,
    formState: { errors },
    getValues,
  } = methods

  const resultat = watch('resultat')

  const lagreTotrinnskontroll = () => {
    const formData = getValues()

    setLoading(true)
    put(`${baseUrl}/api/sak/${sak!.data.sakId}/kontroll`, formData)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        mutate(`api/sak/${sak!.data.sakId}`)
        mutate(`api/sak/${sak!.data.sakId}/historikk`)
      })
  }

  const totrinnkontrollMulig =
    sak?.data.steg === StegType.GODKJENNE && sak?.data.totrinnskontroll?.saksbehandler.id !== saksbehandler.id
  return (
    <>
      {!totrinnkontrollMulig ? (
        <SkjemaAlert variant="info">Det er ikke mulig å godkjenne totrinnskontroll for egen sak</SkjemaAlert>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(() => {
              if (resultat === TotrinnskontrollVurdering.GODKJENT) {
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
                  <Radio value={TotrinnskontrollVurdering.GODKJENT}>Godkjenn</Radio>
                  <Radio value={TotrinnskontrollVurdering.RETURNERT}>Returner til saksbehandler</Radio>
                </RadioGroup>
              )}
            />

            {resultat === TotrinnskontrollVurdering.RETURNERT && (
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
                <Button variant="primary" type="submit" size="small" loading={loading}>
                  {resultat === TotrinnskontrollVurdering.GODKJENT ? 'Godkjenn vedtaket' : 'Returner saken'}
                </Button>
              }
            </Avstand>
          </form>
        </FormProvider>
      )}

      <BekreftelsesModal
        heading="Vil du godkjenne vedtaket?"
        buttonLabel="Godkjenn vedtak"
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
      >
        <Brødtekst>Vedtaket blir fattet og brevet sendes til adressen til barnet.</Brødtekst>
      </BekreftelsesModal>
    </>
  )
}
