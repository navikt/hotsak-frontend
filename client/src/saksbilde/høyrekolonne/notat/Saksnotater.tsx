import { BodyLong, BodyShort, Box, Detail, HStack, Label, VStack } from '@navikt/ds-react'

import { ListeUtenPunkt } from '../../../felleskomponenter/Liste.tsx'
import { formaterTidsstempel } from '../../../utils/dato'
import { HøyrekolonnePanel } from '../HøyrekolonnePanel.tsx'
import { LagreSaksnotatForm } from './LagreSaksnotatForm'
import { useSaksnotater } from './useSaksnotater'

export interface SaksnotaterProps {
  sakId?: string
  lesevisning: boolean
}

export function Saksnotater(props: SaksnotaterProps) {
  const { sakId, lesevisning } = props
  const { notater, mutate, isLoading } = useSaksnotater(sakId)

  if (!sakId || isLoading) {
    return null
  }

  return (
    <HøyrekolonnePanel tittel="Notater">
      <VStack gap="5">
        {!lesevisning && <LagreSaksnotatForm sakId={sakId} mutate={mutate} />}
        {notater.length ? (
          <VStack as={ListeUtenPunkt} gap="2" title="Notater">
            {notater.map((notat) => (
              <Box
                key={notat.id || notat.opprettet}
                as="li"
                padding="4"
                borderRadius="large"
                borderWidth="1"
                style={{ background: 'var(--a-orange-50)', borderColor: 'var(--a-orange-100)' }}
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
    </HøyrekolonnePanel>
  )
}
