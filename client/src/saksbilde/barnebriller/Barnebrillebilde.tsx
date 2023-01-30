import React, { useEffect, useState } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import styled from 'styled-components'

import { Tabs } from '@navikt/ds-react'

import { AlertError } from '../../feilsider/AlertError'
import { Oppgavetype, StegType } from '../../types/types.internal'
import { LasterPersonlinje } from '../Personlinje'
import { useBrillesak } from '../sakHook'
import RegistrerSøknad from './steg/søknadsregistrering/RegistrerSøknad'
import { Vedtak } from './steg/vedtak/Vedtak'
import { VurderVilkår } from './steg/vilkårsvurdering/VurderVilkår'

const BarnebrilleBildeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`
const BarnebrilleContent: React.FC = React.memo(() => {
  const { sak, isLoading, isError } = useBrillesak()
  const [valgtTab, setValgtTab] = useState(sak?.steg.toString() || StegType.INNHENTE_FAKTA.toString())
  const handleError = useErrorHandler()

  if (isError) {
    handleError(isError)
  }

  useEffect(() => {
    if (sak && sak.steg !== valgtTab) {
      setValgtTab(sak.steg)
    }
  }, [sak?.steg, valgtTab])

  if (sak?.sakstype !== Oppgavetype.BARNEBRILLER) {
    throw new Error(
      `Feil ved visning av sak. Forventer at sak skal være av type BARNEBRILLER, men var ${sak?.sakstype} `
    )
  }

  if (!sak) return <div>Fant ikke saken</div>

  const { steg } = sak

  return (
    <TabContainer>
      <Tabs defaultValue={StegType.INNHENTE_FAKTA.toString()} value={valgtTab} loop onChange={setValgtTab}>
        <Tabs.List>
          <Tabs.Tab value={StegType.INNHENTE_FAKTA.toString()} label="1. Registrer søknad" />
          <Tabs.Tab value={StegType.VURDERE_VILKÅR.toString()} label="2. Vilkårsvurdering" />
          <Tabs.Tab value={StegType.VEDTAK.toString()} label="3. Vedtak" />
        </Tabs.List>
        <Tabs.Panel value={StegType.INNHENTE_FAKTA.toString()}>
          <RegistrerSøknad />
        </Tabs.Panel>
        <Tabs.Panel value={StegType.VURDERE_VILKÅR.toString()}>
          <VurderVilkår />
        </Tabs.Panel>
        <Tabs.Panel value={StegType.VEDTAK.toString()}>
          <Vedtak />
        </Tabs.Panel>
      </Tabs>
    </TabContainer>
  )
})

const LasterBarnebrilleBilde = () => (
  <BarnebrilleBildeContainer>
    <LasterPersonlinje />
  </BarnebrilleBildeContainer>
)

export const BarnebrilleBilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterBarnebrilleBilde />}>
      <BarnebrilleContent />
    </React.Suspense>
  </ErrorBoundary>
)

const TabContainer = styled.div`
  padding-top: var(--a-spacing-4);
`

export default BarnebrilleBilde
