import { useNyttSaksbilde } from '../../sak/v2/useNyttSaksbilde'
import { Signaturtype } from '../../types/BehovsmeldingTypes'
import { BrukerBekreftet } from './BrukerBekreftet'
import { Fullmakt } from './Fullmakt'
import { FullmaktFritak } from './FullmaktFritak'
import { IkkkeInnhentetFordiKunTilbehør } from './IkkeInnhentetFordiKunTilbehør'
import { IkkkeInnhentetFordiKunTilbehørV2 } from './IkkeInnhentetFordiKunTilbehørV2'
import { IkkkeInnhentetFordiKunTilbehørV3 } from './IkkeInnhentetFordiKunTilbehørV3'

export interface HeadingProps {
  headingLevel: '1' | '2'
}

interface SignaturProps {
  signaturType: Signaturtype
  navn: string
}

export function Signatur({ signaturType, navn }: SignaturProps) {
  const nyttSaksbilde = useNyttSaksbilde()

  const headingLevel = nyttSaksbilde ? '2' : '1'

  switch (signaturType) {
    case Signaturtype.BRUKER_BEKREFTER:
      return <BrukerBekreftet navn={navn} headingLevel={headingLevel} />
    case Signaturtype.FULLMAKT:
      return <Fullmakt navn={navn} headingLevel={headingLevel} />
    case Signaturtype.FRITAK_FRA_FULLMAKT:
      return <FullmaktFritak navn={navn} headingLevel={headingLevel} />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR:
      return <IkkkeInnhentetFordiKunTilbehør headingLevel={headingLevel} />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V2:
      return <IkkkeInnhentetFordiKunTilbehørV2 headingLevel={headingLevel} />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V3:
      return <IkkkeInnhentetFordiKunTilbehørV3 headingLevel={headingLevel} />
    default:
      return null
  }
}
