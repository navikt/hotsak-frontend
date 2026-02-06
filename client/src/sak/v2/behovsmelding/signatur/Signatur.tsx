import { Signaturtype } from '../../../../types/BehovsmeldingTypes'
import { BrukerBekreftetEksperiment } from './BrukerBekreftetEksperiment'
import { FullmaktEksperiment } from './FullmaktEksperiment'
import { FullmaktFritakEksperiment } from './FullmaktFritakEksperiment'
import { IkkkeInnhentetFordiKunTilbehørEksperiment } from './IkkeInnhentetFordiKunTilbehørEksperiment'
import { IkkkeInnhentetFordiKunTilbehørV2Eksperiment } from './IkkeInnhentetFordiKunTilbehørV2Eksperiment'
import { IkkkeInnhentetFordiKunTilbehørV3Eksperiment } from './IkkeInnhentetFordiKunTilbehørV3Eksperiment'

interface SignaturEksperimentProps {
  signaturType: Signaturtype
  navn: string
}

export function SignaturEksperiment({ signaturType, navn }: SignaturEksperimentProps) {
  switch (signaturType) {
    case Signaturtype.BRUKER_BEKREFTER:
      return <BrukerBekreftetEksperiment navn={navn} />
    case Signaturtype.FULLMAKT:
      return <FullmaktEksperiment navn={navn} />
    case Signaturtype.FRITAK_FRA_FULLMAKT:
      return <FullmaktFritakEksperiment navn={navn} />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR:
      return <IkkkeInnhentetFordiKunTilbehørEksperiment />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V2:
      return <IkkkeInnhentetFordiKunTilbehørV2Eksperiment />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V3:
      return <IkkkeInnhentetFordiKunTilbehørV3Eksperiment />
    default:
      return null
  }
}
