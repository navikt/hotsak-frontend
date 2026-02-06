import { HStack } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../../felleskomponenter/typografi'
import { KontaktpersonProps, lagKontaktpersonTekst } from '../../../saksbilde/bruker/Kontaktperson'

export function KontaktpersonEksperiment({ levering }: KontaktpersonProps) {
  if (!levering.utleveringKontaktperson) return null
  const kontaktpersonTekst = lagKontaktpersonTekst(levering)
  return (
    <HStack gap="space-6">
      <Etikett>Kontaktperson:</Etikett>
      <Tekst>{kontaktpersonTekst}</Tekst>
    </HStack>
  )
}
