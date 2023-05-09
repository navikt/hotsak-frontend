import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { Button, Detail, Radio, RadioGroup } from '@navikt/ds-react'

import { putOppdaterVilkår } from '../../../../io/http'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Kolonner } from '../../../../felleskomponenter/Kolonner'
import { Tekstområde } from '../../../../felleskomponenter/skjema/Tekstfelt'
import { OppdaterVilkårData, Vilkår, VilkårsResultat } from '../../../../types/types.internal'

export function SaksbehandlersVurderingForm({
  sakId,
  vilkår,
  onSaved,
}: {
  sakId: number | string
  vilkår: Vilkår
  onSaved: () => any
}) {
  const [venterPåVilkårsvurdering, setVenterPåVilkårsvurdering] = useState(false)
  const methods = useForm<OppdaterVilkårData>({
    defaultValues: {
      resultatSaksbehandler: vilkår.resultatSaksbehandler ? vilkår.resultatSaksbehandler : vilkår.resultatAuto || '',
      begrunnelseSaksbehandler: vilkår.begrunnelseSaksbehandler || '',
    },
  })

  const {
    control,
    formState: { errors },
  } = methods

  const oppdaterVilkår = (vilkårID: string, data: OppdaterVilkårData) => {
    setVenterPåVilkårsvurdering(true)
    putOppdaterVilkår(sakId, vilkårID, data)
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
            </RadioGroup>
          )}
        />

        <Avstand paddingTop={4}>
          <Tekstområde
            size="small"
            label="Begrunnelse"
            description="Skriv din individuelle begrunnelse"
            error={errors.begrunnelseSaksbehandler?.message}
            {...methods.register('begrunnelseSaksbehandler', { required: 'Skriv inn begrunnelse' })}
          ></Tekstområde>
        </Avstand>
        <Avstand paddingTop={4}>
          <Kolonner>
            <Button variant="primary" size="small" type="submit" loading={venterPåVilkårsvurdering}>
              Lagre
            </Button>
            <Button variant="secondary" size="small">
              Avbryt
            </Button>
          </Kolonner>
        </Avstand>
      </form>
    </FormProvider>
  )
}
