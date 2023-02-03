import { Controller, useFormContext } from 'react-hook-form'
import { errorSelector } from 'recoil'

import { Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { ManuellVurdering, VilkårSvar } from '../../../../../types/types.internal'

export function KomplettBrille() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<{ komplettBrille: ManuellVurdering }>()

  return (
    <>
      <Avstand paddingTop={6}>
        <Heading level="2" size="xsmall" spacing>
          § 2 Komplett brille
        </Heading>
        <Controller
          name="komplettBrille.vilkårOppfylt"
          control={control}
          rules={{ required: 'Velg en verdi' }}
          render={({ field }) => (
            <RadioGroup
              legend="Er det en komplett brille?"
              size="small"
              {...field}
              error={errors.komplettBrille?.vilkårOppfylt?.message}
            >
              <Radio value={VilkårSvar.JA}>Ja</Radio>
              <Radio value={VilkårSvar.NEI}>Nei</Radio>
              <Radio value={VilkårSvar.DOKUMENTASJON_MANGLER}>Dokumentasjon mangler</Radio>
            </RadioGroup>
          )}
        />
      </Avstand>
      <Avstand paddingTop={4}>
        <Textarea
          size="small"
          label="Begrunnelse"
          description="Skriv din individuelle begrunnelse"
          {...register('komplettBrille.begrunnelse')}
        ></Textarea>
      </Avstand>
    </>
  )
}
