import { Controller, useFormContext } from 'react-hook-form'

import { HStack, HelpText, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { Etikett } from '../../../../../felleskomponenter/typografi'
import { VilkårsResultat, Vurdering } from '../../../../../types/types.internal'

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
        <Controller
          name="komplettBrille.vilkårOppfylt"
          control={control}
          rules={{ required: 'Velg en verdi' }}
          render={({ field }) => (
            <RadioGroup
              legend={
                <HStack wrap={false} gap="2" align={'center'}>
                  <Etikett>§2 Inneholder bestillingen glass?</Etikett>
                  <HelpText>Bestillingen må inneholde glass, det gis ikke støtte til kun innfatning (§2)</HelpText>
                </HStack>
              }
              size="small"
              {...field}
              error={errors.komplettBrille?.vilkårOppfylt?.message}
            >
              <Radio value={VilkårsResultat.JA}>Ja</Radio>
              <Radio value={VilkårsResultat.NEI}>Nei</Radio>
              <Radio value={VilkårsResultat.OPPLYSNINGER_MANGLER}>Opplysninger mangler</Radio>
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
