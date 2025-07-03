import { useFormContext, Controller } from 'react-hook-form'
import { RadioGroup, Radio, Textarea, VStack } from '@navikt/ds-react'
import { EndretHjelpemiddelBegrunnelse, EndretHjelpemiddelBegrunnelseLabel } from '../../../types/types.internal'

const MAX_TEGN_BEGRUNNELSE_FRITEKST = 150

export function BegrunnelseForBytte() {
  const { control, watch } = useFormContext()
  const begrunnelse = watch('endreBegrunnelse')

  return (
    <VStack gap="3" paddingBlock="4 0">
      <Controller
        name="endreBegrunnelse"
        control={control}
        rules={{ required: 'Du må velge en begrunnelse' }}
        render={({ field, fieldState }) => (
          <RadioGroup
            size="small"
            legend="Begrunnelse for å endre HMS-nummer:"
            {...field}
            error={fieldState.error?.message}
          >
            <Radio value={EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_LAGERVARE}>
              {EndretHjelpemiddelBegrunnelseLabel.get(EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_LAGERVARE)}
            </Radio>
            <Radio value={EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET}>
              {EndretHjelpemiddelBegrunnelseLabel.get(EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET)}
              (begrunn)
            </Radio>
          </RadioGroup>
        )}
      />
      {begrunnelse === EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET && (
        <Controller
          name="endreBegrunnelseFritekst"
          control={control}
          rules={{
            required: 'Du må fylle inn en begrunnelse',
            maxLength: {
              value: MAX_TEGN_BEGRUNNELSE_FRITEKST,
              message: `Maks ${MAX_TEGN_BEGRUNNELSE_FRITEKST} tegn`,
            },
          }}
          render={({ field, fieldState }) => (
            <Textarea
              label="Begrunn endringen"
              rows={3}
              size="small"
              description="Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også bli brukt i videreutvikling av løsningen."
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
      )}
    </VStack>
  )
}
