import { Controller, useFormContext } from 'react-hook-form'

import { HStack, HelpText, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { Etikett } from '../../../../../felleskomponenter/typografi'
import { VilkårsResultat, Vurdering } from '../../../../../types/types.internal'

export function BestiltHosOptiker() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<{ bestiltHosOptiker: Vurdering }>()

  const vilkårOppfylt = watch('bestiltHosOptiker.vilkårOppfylt')

  return (
    <Avstand paddingTop={10}>
      <Controller
        name="bestiltHosOptiker.vilkårOppfylt"
        control={control}
        rules={{ required: 'Velg en verdi' }}
        render={({ field }) => (
          <RadioGroup
            legend={
              <HStack wrap={false} gap="2" align={'center'}>
                <Etikett>Er brillen bestilt hos optiker? (§2)</Etikett>
                <HelpText>
                  For at en virksomhet/nettbutikk skal kunne godkjennes, må det være optiker tilknyttet denne (§2).
                </HelpText>
              </HStack>
            }
            size="small"
            {...field}
            error={errors.bestiltHosOptiker?.vilkårOppfylt?.message}
          >
            <Radio value={VilkårsResultat.JA}>Ja</Radio>
            <Radio value={VilkårsResultat.NEI}>Nei</Radio>
            <Radio value={VilkårsResultat.OPPLYSNINGER_MANGLER}>Opplysninger mangler</Radio>
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
