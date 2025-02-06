import { Signaturtype } from '../../types/BehovsmeldingTypes'
import { BrukerBekreftet } from './BrukerBekreftet'
import { Fullmakt } from './Fullmakt'
import { FullmaktFritak } from './FullmaktFritak'
import { IkkkeInnhentetFordiKunTilbehør } from './IkkeInnhentetFordiKunTilbehør'

interface SignaturProps {
  signaturType: Signaturtype
  navn: string
}

export function Signatur({ signaturType, navn }: SignaturProps) {
  switch (signaturType) {
    case Signaturtype.BRUKER_BEKREFTER:
      return <BrukerBekreftet navn={navn} />
    case Signaturtype.FULLMAKT:
      return <Fullmakt navn={navn} />
    case Signaturtype.FRITAK_FRA_FULLMAKT:
      return <FullmaktFritak navn={navn} />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR:
      return <IkkkeInnhentetFordiKunTilbehør />
    default:
      return null
  }
}
