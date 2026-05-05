import { Button, Heading, Select, VStack } from '@navikt/ds-react'
import { ChangeEventHandler, useEffect, useState } from 'react'

import { InnloggetAnsatt } from '../tilgang/Ansatt.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import classes from './Utviklingsverktøy.module.css'

export function Utviklingsverktøy() {
  const { id: innloggetSaksbehandlerId } = useInnloggetAnsatt()
  const [saksbehandlere, setSaksbehandlere] = useState<InnloggetAnsatt[]>([])
  const [erSkjult, setErSkjult] = useState(false)

  useEffect(() => {
    if (!window.appSettings.USE_MSW) {
      return
    }
    window.store.saksbehandlere().then(setSaksbehandlere).catch(console.warn)
  }, [])

  const handleSkjul = (skjult: boolean) => {
    setErSkjult(skjult)
  }

  if (!window.appSettings.USE_MSW) {
    return null
  }

  if (erSkjult) {
    return (
      <div className={classes.wrapper}>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            handleSkjul(false)
          }}
          tabIndex={-1}
        >
          Vis utviklingsverktøy
        </Button>
      </div>
    )
  }

  const byttSaksbehandler: ChangeEventHandler<HTMLSelectElement> = async (event) => {
    window.store.byttInnloggetSaksbehandler(event.target.value)
    window.location.reload()
  }

  return (
    <div className={classes.wrapper}>
      <Button
        data-testid={'utviklerverktoy-lukk'}
        style={{ position: 'absolute', top: '7px', right: '7px' }}
        size="small"
        variant="secondary"
        onClick={() => {
          handleSkjul(true)
        }}
        tabIndex={-1}
      >
        -
      </Button>
      <VStack gap="space-8">
        <Heading size="xsmall">[UTVIKLINGSVERKTØY]</Heading>
        <Select
          data-testid="select-bytt-bruker"
          size="small"
          label="Innlogget saksbehandler"
          value={innloggetSaksbehandlerId}
          onChange={byttSaksbehandler}
        >
          {saksbehandlere.map(({ id, navn }) => (
            <option key={id} value={id}>
              {navn}
            </option>
          ))}
        </Select>
        <div>
          <Button
            size="small"
            variant="secondary"
            onClick={async () => {
              await window.store.delete()
              window.location.reload()
            }}
          >
            Slett testdata
          </Button>
        </div>
      </VStack>
    </div>
  )
}
