import { Signaturtype } from '../../../../types/BehovsmeldingTypes'
import { formaterNavn } from '../../../../utils/formater'
import { BrukerBekreftet } from './BrukerBekreftet'
import { FullmaktFritak } from './FullmaktFritak'
import { Bruker as Hjelpemiddelbruker } from '../../../../types/types.internal'
import { IkkkeInnhentetFordiKunTilbehør } from './IkkeInnhentetFordiKunTilbehør'
import { IkkkeInnhentetFordiKunTilbehørV2 } from './IkkeInnhentetFordiKunTilbehørV2'
import { IkkkeInnhentetFordiKunTilbehørV3 } from './IkkeInnhentetFordiKunTilbehørV3'
import { Fullmakt } from './Fullmakt'

interface SignaturProps {
  bruker: Hjelpemiddelbruker
  signaturType: Signaturtype
}

export function SignaturV2({ bruker, signaturType }: SignaturProps) {
  const formatertNavn = formaterNavn(bruker)

  switch (signaturType) {
    case Signaturtype.BRUKER_BEKREFTER:
      return <BrukerBekreftet navn={formatertNavn} />
    case Signaturtype.FULLMAKT:
      return <Fullmakt navn={formatertNavn} />
    case Signaturtype.FRITAK_FRA_FULLMAKT:
      return <FullmaktFritak navn={formatertNavn} />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR:
      return <IkkkeInnhentetFordiKunTilbehør />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V2:
      return <IkkkeInnhentetFordiKunTilbehørV2 />
    case Signaturtype.IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V3:
      return <IkkkeInnhentetFordiKunTilbehørV3 />
    default:
      return null
  }
}
