import { ChevronDownIcon, PlusCircleIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, Tabs, Tag, VStack } from '@navikt/ds-react'
import { type ReactNode, useState } from 'react'
import { useMiljø } from '../utils/useMiljø.ts'

import { isVedtaksbrev } from './brevSelectors.ts'
import { type Brev, BrevmalTekst, type BrevmottakerResponse } from './brevTyper.ts'
import { DelKopiMedFormidler } from './DelKopiMedFormidler.tsx'
import { useBrevmottakere } from './useBrev.ts'

export interface BrevHeaderProps {
  brev: Brev[]
  valgtBrevId?: string
  onVelgBrev(brevId: string): void
  kanRedigere?: boolean
  handlinger?: ReactNode
}

export function BrevHeader({ brev, valgtBrevId, onVelgBrev, kanRedigere = false, handlinger }: BrevHeaderProps) {
  const { erIkkeProd } = useMiljø()
  const [innstillingerÅpen, setInnstillingerÅpen] = useState(false)
  const { data } = useBrevmottakere(valgtBrevId)
  const erVedtaksbrevValgt = brev.some((b) => b.brevId === valgtBrevId && isVedtaksbrev(b))
  const flereMottakere = (data?.brevmottakere?.length ?? 0) > 1
  const erUtkastValgt = brev.some((b) => b.brevId === valgtBrevId && b.brevstatus === 'UTKAST')

  return (
    <Box borderRadius="12" marginBlock="space-0 space-4">
      {erIkkeProd && (
        <Tabs value={valgtBrevId ?? ''} onChange={onVelgBrev} size="small">
          <Tabs.List>
            {brev.map((b) => (
              <Tabs.Tab key={b.brevId} value={b.brevId} label={BrevmalTekst[b.brevmal]} />
            ))}
            {erIkkeProd && (
              <Tabs.Tab
                key="nytt-utkast"
                value="nytt-utkast"
                label="Nytt utkast"
                icon={<PlusCircleIcon fontSize="1.5rem" />}
              />
            )}
          </Tabs.List>
        </Tabs>
      )}
      {valgtBrevId && valgtBrevId != 'nytt-utkast' && (
        <Box padding="space-8">
          <HStack justify="space-between">
            <HStack gap="space-4">
              {erIkkeProd && (
                <>
                  {erUtkastValgt && (
                    <Button
                      variant="tertiary"
                      size="small"
                      aria-expanded={innstillingerÅpen}
                      onClick={() => setInnstillingerÅpen(!innstillingerÅpen)}
                      icon={<ChevronDownIcon fontSize="1.3rem" />}
                    >
                      Innstillinger
                    </Button>
                  )}
                  {flereMottakere && (
                    <Tag variant="warning" size="small">
                      Flere mottakere
                    </Tag>
                  )}
                </>
              )}
            </HStack>
            <HStack gap="space-4">{handlinger}</HStack>
          </HStack>
        </Box>
      )}
      {innstillingerÅpen && erUtkastValgt && (
        <BrevHeaderInnstillinger
          key={valgtBrevId}
          valgtBrevId={valgtBrevId}
          mottakere={erVedtaksbrevValgt ? data : undefined}
          kanRedigere={kanRedigere}
        />
      )}
    </Box>
  )
}

interface BrevHeaderInnstillingerProps {
  valgtBrevId?: string
  mottakere?: BrevmottakerResponse
  kanRedigere: boolean
}

export function BrevHeaderInnstillinger({ valgtBrevId, mottakere, kanRedigere }: BrevHeaderInnstillingerProps) {
  return (
    <Box padding="space-20">
      <VStack gap="space-8">
        <Heading level="2" size="xsmall">
          Innstillinger for brevet
        </Heading>
        {mottakere && <DelKopiMedFormidler brevId={valgtBrevId} mottakere={mottakere} kanRedigere={kanRedigere} />}
      </VStack>
    </Box>
  )
}
