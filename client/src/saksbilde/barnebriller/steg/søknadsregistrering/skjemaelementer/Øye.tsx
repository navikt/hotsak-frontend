import { Controller, useFormContext } from 'react-hook-form'
import styled from 'styled-components'

import { Detail, Select } from '@navikt/ds-react'

import { capitalize } from '../../../../../utils/stringFormating'

import { Brilleseddel } from '../../../../../types/types.internal'
import { MAX_SFÆRE, MAX_STYRKE, MAX_SYLINDER } from '../../../config'
import { FormatertStyrke } from '../FormatertStyrke'

export function Øye(props: { type: 'venstre' | 'høyre' }) {
  const { type } = props
  const {
    control,
    formState: { errors },
  } = useFormContext<{ brilleseddel: Brilleseddel }>()
  return (
    <>
      <Detail>{`${capitalize(type)} øye`}</Detail>

      <Grid>
        <Controller
          name={`brilleseddel.${type}Sfære`}
          control={control}
          rules={{
            required: 'Mangler verdi',
          }}
          render={({ field }) => (
            <Select
              label={'Sfære (SPH)'}
              size="small"
              error={errors.brilleseddel?.[`${type}Sfære`]?.message}
              {...field}
            >
              <option value="">Velg sfære</option>
              {range(0, MAX_SFÆRE).map((it) => (
                <option key={it} value={it}>
                  <FormatertStyrke verdi={it} type="sfære" />
                </option>
              ))}
            </Select>
          )}
        />

        <Controller
          name={`brilleseddel.${type}Sylinder`}
          control={control}
          rules={{
            required: 'Mangler verdi',
          }}
          render={({ field }) => (
            <Select
              style={{ maxWidth: '330px' }}
              label="Cylinder (CYL)"
              size="small"
              error={errors.brilleseddel?.[`${type}Sylinder`]?.message}
              {...field}
            >
              <option value="">Velg sylinder</option>
              {range(0, MAX_SYLINDER).map((it) => (
                <option key={it} value={it}>
                  <FormatertStyrke verdi={it} type="sylinder" />
                </option>
              ))}
            </Select>
          )}
        />
      </Grid>
    </>
  )
}

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 150px 150px;
  gap: var(--a-spacing-5);
  padding-top: var(--a-spacing-3);
  padding-bottom: var(--a-spacing-3);
  align-items: start;
`

function range(start: number, stop: number, step = 0.25): number[] {
  const size = (stop - start) * 4 + 1
  const valg = Array(size)
    .fill(step)
    .map((x, y) => x * y)
  return [...valg, MAX_STYRKE]
}
