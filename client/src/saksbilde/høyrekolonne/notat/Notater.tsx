import '@mdxeditor/editor/style.css'
import { Box, List, Loader, ReadMore, ToggleGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { FilterChips } from '../../../felleskomponenter/filter/FilterChips.tsx'
import type { FilterOption } from '../../../felleskomponenter/filter/filterTypes.ts'
import { Brødtekst, Etikett, Mellomtittel, Tekst } from '../../../felleskomponenter/typografi.tsx'
import { NotatType } from '../../../types/types.internal.ts'
import { ForvaltningsnotatForm } from './ForvaltningsnotatForm.tsx'
import { InterntNotatForm } from './InterntNotatForm.tsx'
import { NotatCard } from './NotatCard.tsx'
import { useNotater } from './useNotater.tsx'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}
export interface NotatFormValues {
  tittel: string
  tekst: string
}

export function Notater({ sakId, lesevisning }: NotaterProps) {
  const { notater, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const [notatType, setNotatType] = useState<string>(NotatType.INTERNT.toString())

  const filterOptions: FilterOption[] = [
    { key: 'ALLE', label: 'Alle' },
    { key: NotatType.INTERNT.toString(), label: 'Internt arbeidsnotat' },
    { key: NotatType.JOURNALFØRT.toString(), label: 'Forvaltningsnotat' },
  ]
  const [filter, setFilter] = useState(['ALLE'])

  return (
    <>
      <VStack gap="2">
        <ReadMore size="small" header="Når skal du bruke de ulike notattypene">
          <Etikett>Internt arbeidsnotat</Etikett>
          <Brødtekst spacing>
            Brukes for egne notater, for eksempel huskelapper til deg selv. Disse journalføres ikke. Merk at brukere kan
            få innsyn i interne notater hvis de ber om det.
          </Brødtekst>
          <Etikett>Forvaltningsnotat</Etikett>
          <Brødtekst>
            Brukes hvis du skal dokumentere opplysninger som kan ha betydning for utfallet av en sak. Disse notatene
            blir journalført. Vi har to typer forvaltningsnotat:
          </Brødtekst>
          <List size="small" as="ul">
            <List.Item>
              <Etikett>Interne saksopplysninger:</Etikett>
              <Brødtekst>
                Opplysninger som kan ha betydning for saken som for eksempel gjengir innholdet i en iakttakelse, et
                møte, en befaring eller en uttalelse fra intern fagperson. Notatet vil ikke være synlig på brukers side
                på nav.no, men bruker vil kunne be om innsyn i det.
              </Brødtekst>
            </List.Item>
            <List.Item>
              <Etikett>Eksterne saksopplysninger: </Etikett>
              <Brødtekst>
                Opplysninger som gjengir innholdet i en henvendelse eller dialog med tredjepart. Bruker vil få innsyn i
                notatet på innlogget side på nav.no fra første virkedag etter at det er ferdigstilt.
              </Brødtekst>
            </List.Item>
          </List>
        </ReadMore>
        <Box paddingBlock="6 0">
          <ToggleGroup
            size="small"
            value={notatType}
            label="Opprett nytt notat"
            onChange={(notatType) => setNotatType(notatType)}
          >
            <ToggleGroup.Item value={NotatType.INTERNT.toString()} label="Internt arbeidsnotat" />
            <ToggleGroup.Item value={NotatType.JOURNALFØRT.toString()} label="Forvaltningsnotat" />
          </ToggleGroup>
        </Box>
      </VStack>
      {notaterLaster && (
        <div>
          <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
        </div>
      )}

      {notatType === NotatType.JOURNALFØRT ? (
        <ForvaltningsnotatForm sakId={sakId} lesevisning={lesevisning} />
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
