import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Button, Detail, Panel, Radio, RadioGroup } from '@navikt/ds-react'

import { putOppdaterVilkår } from '../../../../io/http'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Kolonner } from '../../../../felleskomponenter/Kolonner'
import { Tekstområde } from '../../../../felleskomponenter/skjema/Tekstfelt'
import { OppdaterVilkårData, VilkårSvar } from '../../../../types/types.internal'

export function SaksbehandlersVurdering({
  sakID,
  vilkårID,
  onMutate,
}: {
  sakID: string
  vilkårID: string
  onMutate: (...args: any[]) => any
}) {
  const [venterPåVilkårsvurdering, setVenterPåVilkårsvurdering] = useState(false)
  console.log('Lager form for ' + sakID, vilkårID)

  const methods = useForm<OppdaterVilkårData>({
    defaultValues: {
      resultatSaksbehandler: '',
      begrunnelseSaksbehandler: '',
    },
  })

  const {
    control,
    formState: { errors },
  } = methods

  const oppdaterVilkår = (vilkårID: string, data: OppdaterVilkårData) => {
    setVenterPåVilkårsvurdering(true)
    putOppdaterVilkår(sakID, vilkårID, data)
      .catch(() => setVenterPåVilkårsvurdering(false))
      .then(() => {
        setVenterPåVilkårsvurdering(false)
        onMutate()
      })
  }

  return (
    <Merknad>
      <SaksbehandlersVurderingPanel>
        <FormProvider {...methods} key={`${sakID}-${vilkårID}`}>
          <form
            onSubmit={methods.handleSubmit((data) => {
              console.log('data', data)

              oppdaterVilkår(vilkårID, data)
            })}
          >
            <Detail uppercase spacing>
              Din vurdering
            </Detail>
            <Controller
              name="resultatSaksbehandler"
              control={control}
              rules={{ required: 'Velg en verdi' }}
              render={({ field }) => (
                <RadioGroup
                  legend="Er vilkåret oppfylt"
                  size="small"
                  {...field}
                  error={errors.resultatSaksbehandler?.message}
                >
                  <Radio value={VilkårSvar.JA}>Ja</Radio>
                  <Radio value={VilkårSvar.NEI}>Nei</Radio>
                </RadioGroup>
              )}
            />

            <Avstand paddingTop={4}>
              <Tekstområde
                size="small"
                label="Begrunnelse"
                description="Skriv din individuelle begrunnelse"
                error={errors.begrunnelseSaksbehandler?.message}
                {...methods.register('begrunnelseSaksbehandler', { required: 'Skriv inn begrunnelse' })}
              ></Tekstområde>
            </Avstand>
            <Avstand paddingTop={4}>
              <Kolonner>
                <Button variant="primary" size="small" type="submit" loading={venterPåVilkårsvurdering}>
                  Lagre
                </Button>
                <Button variant="secondary" size="small">
                  Avbryt
                </Button>
              </Kolonner>
            </Avstand>
          </form>
        </FormProvider>
      </SaksbehandlersVurderingPanel>
    </Merknad>
  )
}

const Merknad = styled.div`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    background-color: var(--a-border-info);
    width: 6px;
    height: 100%;
    bottom: 0;
  }
`

const SaksbehandlersVurderingPanel = styled(Panel)`
  align-items: left;
  background-color: var(--a-gray-100);
`
