import { Button, Heading, Select, VStack } from '@navikt/ds-react'
import { ChangeEventHandler, useState } from 'react'

import { Saksbehandlere } from '../mocks/data/Saksbehandlere.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import classes from './Utviklingsverktøy.module.css'

export function Utviklingsverktøy() {
  const { id: innloggetSaksbehandlerId } = useInnloggetAnsatt()
  const [erSkjult, setErSkjult] = useState(false)

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
    Saksbehandlere.setInnloggetId(event.target.value)
    window.location.reload()
  }

  return (
    <div className={classes.wrapper}>
      <Button
        data-testid={'utviklerverktoy-lukk'}
        className={classes.closeButton}
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
          {Saksbehandlere.alle().map(({ id, navn }) => (
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
