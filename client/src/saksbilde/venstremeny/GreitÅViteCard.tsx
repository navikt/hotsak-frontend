import { CheckmarkIcon, ExclamationmarkTriangleFillIcon, InformationSquareIcon } from '@navikt/aksel-icons'

import { GreitÅViteFaktum, GreitÅViteType } from '../../types/types.internal'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { VenstremenyCardRow } from './VenstremenyCardRow.tsx'

export interface GreitÅViteCardProps {
  greitÅViteFakta: GreitÅViteFaktum[]
}

export function GreitÅViteCard({ greitÅViteFakta }: GreitÅViteCardProps) {
  if (greitÅViteFakta.length <= 0) return null

  return (
    <VenstremenyCard heading="Greit å vite">
      {greitÅViteFakta
        .sort((a, b) => {
          if (a.type === b.type) {
            if (a.beskrivelse < b.beskrivelse) return -1
            if (a.beskrivelse > b.beskrivelse) return 1
            return 0
          }
          if (a.type === GreitÅViteType.ADVARSEL) return -1
          if (b.type === GreitÅViteType.ADVARSEL) return 1
          if (a.type === GreitÅViteType.MERKNAD) return -1
          if (b.type === GreitÅViteType.MERKNAD) return 1
          return 0
        })
        .map((faktum) => {
          return (
            <VenstremenyCardRow key={faktum.beskrivelse} icon={ikon(faktum.type)} columns="1.25rem auto">
              {faktum.beskrivelse}
            </VenstremenyCardRow>
          )
        })}
    </VenstremenyCard>
  )
}

function ikon(faktumType: GreitÅViteType) {
  switch (faktumType) {
    case GreitÅViteType.ADVARSEL:
      return <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" />
    case GreitÅViteType.INFO:
      return <CheckmarkIcon />
    case GreitÅViteType.MERKNAD:
      return <InformationSquareIcon />
  }
}
