import { Controller, useFormContext } from 'react-hook-form'
import styled from 'styled-components'

import { Heading, Select } from '@navikt/ds-react'

import { capitalize } from '../../../../../utils/stringFormating'

import { Brilleseddel } from '../../../../../types/types.internal'
import { MAX_SFÆRE, MAX_STYRKE, MAX_SYLINDER, MIN_STYRKE } from '../../../config'
import { FormatertStyrke } from '../FormatertStyrke'

export function Øye(props: { type: 'venstre' | 'høyre' }) {
  const { type } = props
  const {
    control,
    //  formState: { errors },
  } = useFormContext<{ brillestyrke: Brilleseddel }>()
  return (
    <>
      <Heading level="3" size="xsmall">
        {`${capitalize(type)} øye`}
      </Heading>

      <Grid>
        <Controller
          name={`brillestyrke.${type}Sfære`}
          control={control}
          /*rules={{
          required: t('krav.validering_øye'),
        }}*/
          render={({ field }) => (
            <Select
              label={'Sfære (SPH)'}
              size="small"
              //error={errors.brillestyrke?.[`${type}Sfære`]?.message}
              {...field}
            >
              <option value="">Velg sfære</option>
              {range(1, MAX_SFÆRE).map((it) => (
                <option key={it} value={it}>
                  <FormatertStyrke verdi={it} type="sfære" />
                </option>
              ))}
            </Select>
          )}
        />

        <Controller
          name={`brillestyrke.${type}Sylinder`}
          control={control}
          /*rules={{
          required: t('krav.validering_øye'),
        }}*/
          render={({ field }) => (
            <Select
              style={{ maxWidth: '330px' }}
              label="Cylinder (CYL)"
              size="small"
              //error={errors.brillestyrke?.[`${type}Sylinder`]?.message}
              {...field}
            >
              <option value="">Velg sylinder</option>
              {range(1, MAX_SYLINDER).map((it) => (
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 150px 150px;
  gap: var(--a-spacing-5);
  padding-top: var(--a-spacing-3);
  padding-bottom: var(--a-spacing-3);
  align-items: start;
`

function range(start: number, stop: number, step = 0.25): number[] {
  const size = (stop - start) * 4 + 1
  const padding = 1 / step
  const valg = Array(size + padding)
    .fill(step)
    .map((x, y) => x * y)
    .slice(padding)
  return [MIN_STYRKE, ...valg, MAX_STYRKE]
}
