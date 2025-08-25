import { Controller, useFormContext } from 'react-hook-form'
import styled from 'styled-components'

import { Select } from '@navikt/ds-react'

import { storForbokstavIAlleOrd, storForbokstavIOrd } from '../../../../../utils/formater'

import { Brilleseddel } from '../../../../../types/types.internal'
import { MAX_SFÆRE, MAX_SYLINDER } from '../../../config'
import { FormatertStyrke } from '../FormatertStyrke'

export function Øye(props: { type: 'venstre' | 'høyre' }) {
  const { type } = props
  const {
    control,
    watch,
    formState: { errors },
    // eslint skjønner ikke Øye virker det som
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useFormContext<{ brilleseddel: Brilleseddel }>()

  const høyreSfære = watch('brilleseddel.høyreSfære')
  const høyreSylinder = watch('brilleseddel.høyreSylinder')
  const venstreSfære = watch('brilleseddel.venstreSfære')
  const venstreSylinder = watch('brilleseddel.venstreSylinder')

  function tomBrilleseddel(): boolean {
    return !høyreSfære && !høyreSylinder && !venstreSfære && !venstreSylinder
  }

  return (
    <>
      <Grid>
        <Controller
          name={`brilleseddel.${type}Sfære`}
          control={control}
          rules={{
            required: !tomBrilleseddel() && 'Mangler verdi',
          }}
          render={({ field }) => (
            <Select
              label={`${storForbokstavIOrd(type)} sfære (SPH)`}
              size="small"
              error={errors.brilleseddel?.[`${type}Sfære`]?.message}
              {...field}
            >
              {range(-MAX_SFÆRE, 0).map((it) => (
                <option key={it} value={it}>
                  <FormatertStyrke verdi={it} />
                </option>
              ))}
              <option value="" disabled>
                Velg sfære
              </option>
              {range(0.25, MAX_SFÆRE).map((it) => (
                <option key={it} value={it}>
                  <FormatertStyrke verdi={it} />
                </option>
              ))}
            </Select>
          )}
        />

        <Controller
          name={`brilleseddel.${type}Sylinder`}
          control={control}
          rules={{
            required: !tomBrilleseddel() && 'Mangler verdi',
          }}
          render={({ field }) => (
            <Select
              label={`${storForbokstavIAlleOrd(type)} cylinder (CYL)`}
              size="small"
              error={errors.brilleseddel?.[`${type}Sylinder`]?.message}
              {...field}
            >
              {range(-MAX_SYLINDER, 0).map((it) => (
                <option key={it} value={it}>
                  <FormatertStyrke verdi={it} />
                </option>
              ))}
              <option value="" disabled>
                Velg sylinder
              </option>
            </Select>
          )}
        />
      </Grid>
    </>
  )
}

// TODO bytte ut med Hstack?
export const Grid = styled.div`
  display: grid;
  grid-template-columns: 145px 155px;
  gap: var(--ax-space-20);

  align-items: start;
`

function range(start: number, stop: number, step = 0.25): number[] {
  const valg = []
  for (let i = start; i <= stop; i += step) {
    valg.push(i)
  }

  return valg
}
