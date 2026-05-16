import { Loader, VStack } from '@navikt/ds-react'

import { useMemo, useState } from 'react'
import { FilterChips } from '../../felleskomponenter/filter/FilterChips'
import { type FilterOption } from '../../felleskomponenter/filter/filterTypes'
import { Mellomtittel, Tekst } from '../../felleskomponenter/typografi'
import { useOppgavekommentarer, type Oppgavekommentar } from '../../oppgave/kommentar/useOppgavekommentarer'
import { type OppgaveId } from '../../oppgave/oppgaveTypes'
import { isUtførtAvAnsatt, uførtAvId } from '../../tilgang/UtførtAv'
import { MålformType } from '../../types/types.internal'
import { naturalBy, reverseComparator } from '../../utils/array'
import { NotatCard } from './NotatCard'
import { NotatType, type Notat } from './notatTyper'

export interface FerdigstilteNotaterProps {
  oppgaveId?: OppgaveId
  loading?: boolean
  notater: Notat[]
  mutateNotater(): void
}

export function FerdigstilteNotater(props: FerdigstilteNotaterProps) {
  const { oppgaveId, notater, mutateNotater } = props
  const { kommentarer, isLoading } = useOppgavekommentarer(oppgaveId)
  const loading = props.loading ?? isLoading

  const [filter, setFilter] = useState(['ALLE'])

  const alle = useMemo(() => {
    const kommentarerSomNotater = kommentarer?.map(kommentarTilNotat) ?? []
    return [...notater, ...kommentarerSomNotater].sort(reverseComparator(naturalBy((notat) => notat.ferdigstilt)))
  }, [notater, kommentarer])
  const filtrerte = useMemo(() => {
    return alle.filter((notat) => filter[0] === 'ALLE' || filter[0] === notat.type)
  }, [alle, filter])

  return (
    <VStack gap="space-16">
      <Mellomtittel spacing={false}>Notater tilknyttet saken</Mellomtittel>
      {loading ? (
        <div>
          <Loader size="large" />
        </div>
      ) : (
        <>
          {alle.length === 0 && <Tekst>Ingen notater er tilknyttet saken</Tekst>}
          {alle.length > 0 && <FilterChips options={filterOptions} selected={filter} handleChange={setFilter} />}
          {filtrerte.map((notat) => (
            <NotatCard key={notat.id} notat={notat} mutate={mutateNotater} />
          ))}
        </>
      )}
    </VStack>
  )
}

function kommentarTilNotat(kommentar: Oppgavekommentar): Notat {
  const { registrertAv, registrertTidspunkt } = kommentar
  return {
    id: `${uførtAvId(registrertAv)}_${registrertTidspunkt}`,
    sakId: '',
    saksbehandler: isUtførtAvAnsatt(registrertAv)
      ? registrertAv
      : { id: registrertAv, navn: 'Automatisk prosess', epost: '' },
    type: NotatType.KOMMENTAR,
    tittel: '',
    tekst: kommentar.tekst,
    opprettet: registrertTidspunkt,
    oppdatert: registrertTidspunkt,
    ferdigstilt: registrertTidspunkt,
    målform: MålformType.BOKMÅL,
  }
}

const filterOptions: FilterOption[] = [
  { key: 'ALLE', label: 'Alle' },
  { key: NotatType.KOMMENTAR, label: 'Kommentar' },
  { key: NotatType.INTERNT, label: 'Internt arbeidsnotat' },
  { key: NotatType.JOURNALFØRT, label: 'Forvaltningsnotat' },
]
