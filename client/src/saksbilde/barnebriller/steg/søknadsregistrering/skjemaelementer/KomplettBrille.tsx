import { Controller, useFormContext } from 'react-hook-form'

import { Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { Vurdering, VilkårsResultat } from '../../../../../types/types.internal'

export function KomplettBrille() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<{ komplettBrille: Vurdering }>()

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
              <Radio value={VilkårsResultat.JA}>Ja</Radio>
              <Radio value={VilkårsResultat.NEI}>Nei</Radio>
              <Radio value={VilkårsResultat.DOKUMENTASJON_MANGLER}>Dokumentasjon mangler</Radio>
            </RadioGroup>
          )}
        />
      </Avstand>
      {vilkårOppfylt === VilkårsResultat.NEI && (
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
