import { TrashIcon } from '@navikt/aksel-icons'
import { Bleed, BodyLong, BodyShort, Box, Button, Detail, HStack, Label, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { useInnloggetSaksbehandler } from '../../../state/authentication'
import { formaterTidsstempel } from '../../../utils/dato'
import { HøyrekolonnePanel } from '../HøyrekolonnePanel.tsx'
import { LagreSaksnotatForm } from './LagreSaksnotatForm'
import { SlettSaksnotatModal } from './SlettSaksnotatModal'
import { useSaksnotater } from './useSaksnotater'
import { ListeUtenPunkt } from '../../../felleskomponenter/Liste.tsx'

export interface SaksnotaterProps {
  sakId?: string
  lesevisning: boolean
}

export function Saksnotater(props: SaksnotaterProps) {
  const saksbehandler = useInnloggetSaksbehandler()
  const { sakId, lesevisning } = props
  const { notater, mutate, isLoading } = useSaksnotater(sakId)
  const [notatId, setNotatId] = useState(NaN)

  if (!sakId || isLoading) {
    return null
  }

  return (
    <HøyrekolonnePanel tittel="Notater">
      <VStack gap="5">
        {!lesevisning && <LagreSaksnotatForm sakId={sakId} mutate={mutate} />}
        {notater.length ? (
          <VStack as={ListeUtenPunkt} gap="5" title="Notater">
            {notater.map((notat) => (
              <Box
                key={notat.id || notat.opprettet}
                as="li"
                padding="4"
                background="surface-warning-subtle"
                borderRadius="medium"
              >
                <HStack justify="space-between">
                  <div>
                    <Label as="h2" size="small">
                      {notat.saksbehandler.navn}
                    </Label>
                    <Detail>{formaterTidsstempel(notat.opprettet)}</Detail>
                  </div>
                </HStack>
                <BodyLong size="small">{notat.innhold}</BodyLong>
              </Box>
            ))}
          </VStack>
        ) : (
          <BodyShort size="small">Ingen saksnotater.</BodyShort>
        )}
      </VStack>
      {!lesevisning && (
        <SlettSaksnotatModal sakId={sakId} notatId={notatId} mutate={mutate} onClose={() => setNotatId(NaN)} />
      )}
    </HøyrekolonnePanel>
  )
}
