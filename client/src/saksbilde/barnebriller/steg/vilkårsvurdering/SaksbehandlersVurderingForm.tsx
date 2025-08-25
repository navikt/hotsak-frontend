import { Box, Button, Detail, Radio, RadioGroup } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { Kolonner } from '../../../../felleskomponenter/Kolonner'
import { Tekstområde } from '../../../../felleskomponenter/skjema/Tekstfelt'
import { http } from '../../../../io/HttpClient.ts'
import { OppdaterVilkårData, Vilkår, VilkårsResultat } from '../../../../types/types.internal'

export function SaksbehandlersVurderingForm({
  sakId,
  vilkår,
  onSaved,
  onCanceled,
}: {
  sakId: number | string
  vilkår: Vilkår
  onSaved: () => any
  onCanceled: () => any
}) {
  const [venterPåVilkårsvurdering, setVenterPåVilkårsvurdering] = useState(false)
  const methods = useForm<OppdaterVilkårData>({
    defaultValues: {
      resultatSaksbehandler: vilkår.vilkårOppfylt || '',
      begrunnelseSaksbehandler: vilkår.manuellVurdering?.begrunnelse || '',
    },
  })

  const {
    control,
    formState: { errors },
  } = methods

  const oppdaterVilkår = (vilkårId: string, data: OppdaterVilkårData) => {
    setVenterPåVilkårsvurdering(true)
    http
      .put(`/api/sak/${sakId}/vilkar/${vilkårId}`, data)
      .catch(() => setVenterPåVilkårsvurdering(false))
      .then(() => {
        setVenterPåVilkårsvurdering(false)
        onSaved()
      })
  }

  return (
    <FormProvider {...methods} key={`${sakId}-${vilkår.id}`}>
      <form
        onSubmit={methods.handleSubmit((data) => {
          oppdaterVilkår(vilkår.id, data)
        })}
      >
        <Detail uppercase spacing>
          Din vurdering
        </Detail>
        <Controller
          name="resultatSaksbehandler"
          control={control}
          rules={{ required: 'Velg en verdi' }}
          render={({ field }) => (
            <RadioGroup
              legend="Er vilkåret oppfylt"
              size="small"
              {...field}
              error={errors.resultatSaksbehandler?.message}
            >
              <Radio value={VilkårsResultat.JA}>Ja</Radio>
              <Radio value={VilkårsResultat.NEI}>Nei</Radio>
              <Radio value={VilkårsResultat.OPPLYSNINGER_MANGLER}>Opplysning mangler</Radio>
            </RadioGroup>
          )}
        />

        <Box paddingBlock="4 0">
          <Tekstområde
            size="small"
            label="Begrunnelse"
            description="Skriv din individuelle begrunnelse"
            error={errors.begrunnelseSaksbehandler?.message}
            {...methods.register('begrunnelseSaksbehandler', { required: 'Skriv inn begrunnelse' })}
          ></Tekstområde>
        </Box>
        <Box paddingBlock="4 0">
          <Kolonner>
            <Button variant="primary" size="small" type="submit" loading={venterPåVilkårsvurdering}>
              Lagre
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={(e) => {
                e.preventDefault()
                onCanceled()
              }}
            >
              Avbryt
            </Button>
          </Kolonner>
        </Box>
      </form>
    </FormProvider>
  )
}
