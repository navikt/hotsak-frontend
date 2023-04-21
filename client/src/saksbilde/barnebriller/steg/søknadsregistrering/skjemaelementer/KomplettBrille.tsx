import { Controller, useFormContext } from 'react-hook-form'

import { Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { ManuellVurdering, VilkårSvar } from '../../../../../types/types.internal'

export function KomplettBrille() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<{ komplettBrille: ManuellVurdering }>()

  const vilkårOppfylt = watch('komplettBrille.vilkårOppfylt')

  return (
    <>
      <Avstand paddingTop={6}>
        <Heading level="2" size="xsmall" spacing>
          § 2 Bestillingen må inneholde glass
        </Heading>
        <Controller
          name="komplettBrille.vilkårOppfylt"
          control={control}
          rules={{ required: 'Velg en verdi' }}
          render={({ field }) => (
            <RadioGroup
              legend="Inneholder bestillingen glass"
              description="Bestillingen må inneholde glass, det gis ikke støtte til kun innfatning."
              size="small"
              {...field}
              error={errors.komplettBrille?.vilkårOppfylt?.message}
            >
              <Radio value={VilkårSvar.JA}>Ja</Radio>
              <Radio value={VilkårSvar.NEI}>Nei</Radio>
            </RadioGroup>
          )}
        />
      </Avstand>
      {vilkårOppfylt === VilkårSvar.NEI && (
        <Avstand paddingTop={4}>
          <Textarea
            size="small"
            label="Begrunnelse"
            description="Skriv din individuelle begrunnelse"
            {...register('komplettBrille.begrunnelse')}
          ></Textarea>
        </Avstand>
      )}
    </>
  )
}
