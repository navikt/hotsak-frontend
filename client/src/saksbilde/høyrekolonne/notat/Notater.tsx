import '@mdxeditor/editor/style.css'
import { Box, Loader, ReadMore, ToggleGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Brødtekst, Mellomtittel, Tekst } from '../../../felleskomponenter/typografi.tsx'
import { FilterChips } from '../../../oppgaveliste/filter/filter.tsx'
import { NotatType } from '../../../types/types.internal.ts'
import { sorterKronologiskSynkende } from '../../../utils/dato.ts'
import { InterntNotatForm } from './InterntNotatForm.tsx'
import { JournalførtNotatForm } from './JournalførtNotatForm.tsx'
import { NotatCard } from './NotatCard.tsx'
import { useNotater } from './useNotater.tsx'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function Notater({ sakId, lesevisning }: NotaterProps) {
  const { notater, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const [notatType, setNotatType] = useState<string>(NotatType.INTERNT.toString())

  const filterOptions = [
    { key: 'ALLE', label: 'Alle' },
    { key: NotatType.INTERNT.toString(), label: 'Interne' },
    { key: NotatType.JOURNALFØRT.toString(), label: 'Journalførte' },
  ]
  const [filter, setFilter] = useState(['ALLE'])

  return (
    <>
      <VStack gap="2">
        <ReadMore size="small" header="Når skal du bruke de ulike notattypene">
          <Brødtekst spacing>
            Journalføringsnotat skal brukes hvis du har mottatt saksopplysninger utenfra som er med på å avgjøre
            utfallet av en sak. Når du ferdigstiller journalføringsnotatet, blir det tilgjengelig for innbygger neste
            virkedag på innlogget side på nav.no.
          </Brødtekst>
          <Brødtekst>
            Internt notat brukes for egne notater i arbeidsprosessen og drøftinger mellom kolleger. Disse journalføres
            ikke. Merk at brukeren kan få innsyn i interne notater hvis de ber om det.
          </Brødtekst>
        </ReadMore>
        <Box paddingBlock="6 0">
          <ToggleGroup
            size="small"
            value={notatType}
            label="Opprett nytt notat"
            onChange={(notatType) => setNotatType(notatType)}
          >
            <ToggleGroup.Item value={NotatType.INTERNT.toString()} label={`Internt notat`} />
            <ToggleGroup.Item value={NotatType.JOURNALFØRT.toString()} label={`Journalføringsnotat`} />
          </ToggleGroup>
        </Box>
      </VStack>
      {notaterLaster && (
        <div>
          <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
        </div>
      )}

      {notatType === NotatType.JOURNALFØRT ? (
        <JournalførtNotatForm sakId={sakId} lesevisning={lesevisning} />
      ) : (
        <InterntNotatForm sakId={sakId} lesevisning={lesevisning} />
      )}
      <VStack gap="4" paddingBlock="8 0">
        <Mellomtittel spacing={false}>Notater knyttet til saken</Mellomtittel>
        {notaterLaster && (
          <div>
            <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
          </div>
        )}
        {!notaterLaster && notater && (
          <>
            {notater.length === 0 && <Tekst>Ingen notater er knyttet til saken</Tekst>}
            {notater.length > 0 && (
              <FilterChips
                selected={filter}
                options={filterOptions}
                handleChange={(filterValue) => {
                  setFilter(filterValue)
                }}
              />
            )}
            {notater
              .filter((notat) => filter[0] === 'ALLE' || notat.type === filter[0])
              .map((notat) => {
                return <NotatCard key={notat.id} notat={notat} mutate={mutateNotater} />
              })}
          </>
        )}
      </VStack>
    </>
  )
}
