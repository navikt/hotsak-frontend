import { useNyttSaksbilde } from '../../sak/v2/useNyttSaksbilde'
import { Signaturtype } from '../../types/BehovsmeldingTypes'
import { Bruker as Hjelpemiddelbruker } from '../../types/types.internal'
import { formaterNavn } from '../../utils/formater'
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
  bruker: Hjelpemiddelbruker
  signaturType: Signaturtype
}

export function Signatur({ bruker, signaturType }: SignaturProps) {
  const nyttSaksbilde = useNyttSaksbilde()
  const formatertNavn = formaterNavn(bruker)

  const headingLevel = nyttSaksbilde ? '2' : '1'

  switch (signaturType) {
    case Signaturtype.BRUKER_BEKREFTER:
      return <BrukerBekreftet navn={formatertNavn} headingLevel={headingLevel} />
    case Signaturtype.FULLMAKT:
      return <Fullmakt navn={formatertNavn} headingLevel={headingLevel} />
    case Signaturtype.FRITAK_FRA_FULLMAKT:
      return <FullmaktFritak navn={formatertNavn} headingLevel={headingLevel} />
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
