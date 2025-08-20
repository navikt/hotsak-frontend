import { Button, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'

import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Brødtekst } from '../../../../felleskomponenter/typografi'
import { baseUrl, put } from '../../../../io/http'
import { StegType, TotrinnskontrollData, TotrinnskontrollVurdering } from '../../../../types/types.internal'
import { BekreftelseModal } from '../../../komponenter/BekreftelseModal'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { useInnloggetAnsatt } from '../../../../tilgang/useTilgang.ts'

export function TotrinnskontrollForm() {
  const [loading, setLoading] = useState(false)
  const { mutate } = useSWRConfig()
  const [visGodkjenningModal, setVisGodkjenningModal] = useState(false)
  const saksbehandler = useInnloggetAnsatt()
  const { sak } = useBarnebrillesak()
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
        mutate(`/api/sak/${sak!.data.sakId}`)
        mutate(`/api/sak/${sak!.data.sakId}/historikk`)
      })
  }

  const totrinnskontrollMulig =
    sak?.data.steg === StegType.GODKJENNE && sak?.data.totrinnskontroll?.saksbehandler.id !== saksbehandler.id
  return (
    <>
      {!totrinnskontrollMulig ? (
        <SkjemaAlert variant="info">Det er ikke mulig å godkjenne totrinnskontroll for egen sak</SkjemaAlert>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(() => {
              if (resultat === TotrinnskontrollVurdering.GODKJENT) {
                setVisGodkjenningModal(true)
              } else {
                lagreTotrinnskontroll()
              }
            })}
          >
            <VStack gap="3">
              <Controller
                name="resultat"
                control={control}
                rules={{ required: 'Velg en verdi' }}
                render={({ field }) => (
                  <RadioGroup
                    legend="Du må gjøre en vurdering"
                    size="small"
                    {...field}
                    error={errors.resultat?.message}
                  >
                    <Radio value={TotrinnskontrollVurdering.GODKJENT}>Godkjenn</Radio>
                    <Radio value={TotrinnskontrollVurdering.RETURNERT}>Returner til saksbehandler</Radio>
                  </RadioGroup>
                )}
              />
              {resultat === TotrinnskontrollVurdering.RETURNERT && (
                <Textarea
                  size="small"
                  label="Begrunn vurderingen din"
                  description="Skriv hvorfor saken returneres, så det er enkelt å forstå hva som vurderes og gjøres om."
                  error={errors.begrunnelse?.message}
                  {...methods.register('begrunnelse', { required: 'Du må begrunne vurderingen din ' })}
                />
              )}
              <div>
                <Button variant="primary" type="submit" size="small" loading={loading}>
                  {resultat === TotrinnskontrollVurdering.GODKJENT ? 'Godkjenn vedtaket' : 'Returner saken'}
                </Button>
              </div>
            </VStack>
          </form>
        </FormProvider>
      )}
      <BekreftelseModal
        heading="Vil du godkjenne vedtaket?"
        bekreftButtonLabel="Godkjenn vedtak"
        open={visGodkjenningModal}
        onBekreft={() => {
          lagreTotrinnskontroll()
        }}
        loading={loading}
        onClose={() => {
          setVisGodkjenningModal(false)
        }}
      >
        <Brødtekst>Vedtaket blir fattet og brevet sendes til adressen til barnet.</Brødtekst>
      </BekreftelseModal>
    </>
  )
}
