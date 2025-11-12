import { Alert, List } from '@navikt/ds-react'
import { BrytbarBrødtekst, TextContainer } from '../../../../../felleskomponenter/typografi'
import { Hast } from '../../../../../types/BehovsmeldingTypes'
import { Hasteårsak } from '../../../../../types/types.internal'

export function HastEksperiment(props: { hast?: Hast }) {
  const { hast } = props
  if (!hast) return null
  const { hasteårsaker, hastBegrunnelse } = hast
  return (
    <Alert variant="warning" size="small">
      Haster
      <TextContainer>
        <List size="small">
          {hasteårsaker.map((årsak) => (
            <List.Item key={årsak}>
              <BrytbarBrødtekst>{tekstByHasteårsak[årsak]}</BrytbarBrødtekst>
              {årsak === Hasteårsak.ANNET && hastBegrunnelse && <BrytbarBrødtekst>{hastBegrunnelse}</BrytbarBrødtekst>}
            </List.Item>
          ))}
        </List>
      </TextContainer>
    </Alert>
  )
}

const tekstByHasteårsak: Record<keyof typeof Hasteårsak, string> = {
  [Hasteårsak.UTVIKLING_AV_TRYKKSÅR]:
    'Det er stor fare for utvikling av trykksår, eller for å hindre videre utvikling av trykksår.',
  [Hasteårsak.TERMINALPLEIE]: 'Innbygger har behov for terminalpleie.',
  [Hasteårsak.UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES]: 'Utskriving fra sykehus som ikke kan planlegges.',
  [Hasteårsak.UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES_V2]:
    'Innbygger skal skrives ut fra sykehus uten at det var mulig å planlegge. Det er derfor behov for hjelpemidler til stell og pleie slik at utskrivingen kan gjennomføres.',
  [Hasteårsak.UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES_V3]:
    'Innbygger skal skrives ut fra sykehus eller rehabilitering uten at det var mulig å planlegge. Det er derfor behov for hjelpemidler til stell og pleie slik at utskrivingen kan gjennomføres.',
  [Hasteårsak.RASK_FORVERRING_AV_ALVORLIG_DIAGNOSE]: 'Det har skjedd en rask forverring av en alvorlig diagnose.',
  [Hasteårsak.ANNET]: 'Annen årsak til plutselig oppstått behov på grunn av brukers helsesituasjon:',
}
