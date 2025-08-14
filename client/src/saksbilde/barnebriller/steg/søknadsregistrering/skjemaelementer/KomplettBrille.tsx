import { Controller, useFormContext } from 'react-hook-form'

import { HStack, HelpText, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react'

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
    <VStack gap="4">
      <Controller
        name="komplettBrille.vilkårOppfylt"
        control={control}
        rules={{ required: 'Velg en verdi' }}
        render={({ field }) => (
          <RadioGroup
            legend={
              <HStack wrap={false} gap="2" align="center">
                <Etikett>Inneholder bestillingen glass? (§2)</Etikett>
                <HelpText>Bestillingen må inneholde glass, det gis ikke tilskudd til kun innfatning (§2)</HelpText>
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
      {vilkårOppfylt === VilkårsResultat.NEI && (
        <Textarea
          size="small"
          label="Begrunnelse"
          description="Skriv din individuelle begrunnelse"
          {...register('komplettBrille.begrunnelse')}
        ></Textarea>
      )}
    </VStack>
  )
}
