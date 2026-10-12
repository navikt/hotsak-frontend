import { Alert } from '@navikt/ds-react'

import { useMiljø } from '../utils/useMiljø.ts'
import { AnsattGruppe } from './Ansatt.ts'
import { useInnloggetAnsatt } from './useTilgang.ts'

export function LesetilgangVarsel() {
  const { erInnlogget, grupper } = useInnloggetAnsatt()
  const { erProd } = useMiljø()

  if (erProd) {
    return null
  }

  const harKunLesetilgang =
    erInnlogget && grupper.includes(AnsattGruppe.HOTSAK_BRUKERE) && !grupper.includes(AnsattGruppe.HOTSAK_SAKSBEHANDLER)

  if (!harKunLesetilgang) {
    return null
  }

  return (
    <Alert variant="info" size="small" fullWidth contentMaxWidth={false} role="status">
      Du har kun lesetilgang i Hotsak. Du kan ikke behandle saker. Hvis du trenger full tilgang, kontakt
      rolleadministratoren for enheten.
    </Alert>
  )
}
