import { Box, HelpText, HStack, Radio, RadioGroup } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'

import { Tekstfelt } from '../../../../../felleskomponenter/skjema/Tekstfelt'
import { Etikett } from '../../../../../felleskomponenter/typografi'
import { KjøptBrille as IKjøptBrille, VilkårsResultat } from '../../../../../types/types.internal'
import { validator, validering } from './validering/validering'

export function KjøptBrille() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<{ kjøptBrille: IKjøptBrille }>()

  const vilkårOppfylt = watch('kjøptBrille.vilkårOppfylt')

  return (
    <Controller
      name="kjøptBrille.vilkårOppfylt"
      control={control}
      rules={{ required: 'Velg en verdi' }}
      render={({ field }) => (
        <RadioGroup
          legend={
            <HStack wrap={false} gap="2" align="center">
              <Etikett>Er det snakk om kjøp av briller? (§2)</Etikett>
              <HelpText>
                Det gis kun tilskudd til kjøp av brille. Briller som er del av et abonnement støttes ikke (§2).
              </HelpText>
            </HStack>
          }
          size="small"
          {...field}
          error={errors.kjøptBrille?.vilkårOppfylt?.message}
        >
          <Radio value={VilkårsResultat.JA}>Ja</Radio>
          {vilkårOppfylt === VilkårsResultat.JA && (
            <Box paddingInline="7 0" paddingBlock="0 4">
              <Tekstfelt
                id="brillepris"
                htmlSize={8}
                label={
                  <HStack wrap={false} gap="2" align="center">
                    <Etikett>Pris på brillen</Etikett>
                    <HelpText>
                      Skal bare inkludere glass, slip av glass og innfatning, inkl moms, og brilletilpasning. Eventuell
                      synsundersøkelse skal ikke inkluderes i prisen.
                    </HelpText>
                  </HStack>
                }
                error={errors?.kjøptBrille?.brillepris?.message}
                size="small"
                {...register('kjøptBrille.brillepris', {
                  validate: validator(validering.beløp, 'Ugyldig brillepris'),
                })}
              />
            </Box>
          )}
          <Radio value={VilkårsResultat.NEI}>Nei, brillen inngår i et abonnement</Radio>
        </RadioGroup>
      )}
    />
  )
}
