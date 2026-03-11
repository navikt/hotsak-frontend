import { CopyButton, HStack, Tooltip } from '@navikt/ds-react'

import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { type Levering } from '../../types/BehovsmeldingTypes'
import { lagKontaktpersonTekst } from './lagKontaktpersonTekst.ts'

export interface KontaktpersonProps {
  levering: Levering
}

export function Kontaktperson({ levering }: KontaktpersonProps) {
  if (!levering.utleveringKontaktperson) return null
  const kontaktpersonTekst = lagKontaktpersonTekst(levering)
  return (
    <HStack gap="space-6">
      <Etikett>Kontaktperson:</Etikett>
      <HStack>
        <Tekst>{kontaktpersonTekst}</Tekst>
        <Tooltip content="Kopier kontaktperson" placement="right">
          <CopyButton size="xsmall" copyText={kontaktpersonTekst} />
        </Tooltip>
      </HStack>
    </HStack>
  )
}
