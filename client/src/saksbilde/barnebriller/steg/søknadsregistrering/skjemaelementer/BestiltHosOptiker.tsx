import { Controller, useFormContext } from 'react-hook-form'

import { Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { ManuellVurdering, VilkårsResultat } from '../../../../../types/types.internal'

export function BestiltHosOptiker() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<{ bestiltHosOptiker: ManuellVurdering }>()

  const vilkårOppfylt = watch('bestiltHosOptiker.vilkårOppfylt')

  return (
    <Avstand paddingTop={8}>
      <Heading level="2" size="xsmall" spacing>
        § 2 Brillen må være bestilt hos optiker
      </Heading>
      <Controller
        name="bestiltHosOptiker.vilkårOppfylt"
        control={control}
        rules={{ required: 'Velg en verdi' }}
        render={({ field }) => (
          <RadioGroup
            legend="Er brillen bestilt hos optiker"
            description="For at en virksomhet/nettbutikk skal kunne godkjennes, må det være optiker tilknyttet denne."
            size="small"
            {...field}
            error={errors.bestiltHosOptiker?.vilkårOppfylt?.message}
          >
            <Radio value={VilkårsResultat.JA}>Ja</Radio>
            <Radio value={VilkårsResultat.NEI}>Nei</Radio>
          </RadioGroup>
        )}
      />
      {vilkårOppfylt === VilkårsResultat.NEI && (
        <Avstand paddingTop={4}>
          <Textarea
            size="small"
            label="Begrunnelse"
            description="Skriv din individuelle begrunnelse"
            {...register('bestiltHosOptiker.begrunnelse')}
          ></Textarea>
        </Avstand>
      )}
    </Avstand>
  )
}
