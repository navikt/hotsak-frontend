import { SignaturType } from '../../types/types.internal'
import { BrukerBekreftet } from './BrukerBekreftet'
import { Fullmakt } from './Fullmakt'
import { FullmaktFritak } from './FullmaktFritak'

interface SignaturProps {
  signaturType: SignaturType
  navn: string
}

export const Signatur: React.FC<SignaturProps> = ({ signaturType, navn }) => {
  switch (signaturType) {
    case SignaturType.BRUKER_BEKREFTER:
      return <BrukerBekreftet navn={navn} />
    case SignaturType.FULLMAKT:
      return <Fullmakt navn={navn} />
    case SignaturType.FRITAK_FRA_FULLMAKT:
      return <FullmaktFritak navn={navn} />
    default: return null
  }
}
