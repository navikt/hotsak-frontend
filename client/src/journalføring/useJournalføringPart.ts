import { useEffect, useRef, useState } from 'react'

import { http } from '../io/HttpClient.ts'
import { usePerson } from '../personoversikt/usePerson.ts'
import { type Person } from '../types/types.internal.ts'
import { formaterNavn } from '../utils/formater.ts'

interface UseJournalføringPartOptions {
  part: 'Bruker' | 'Avsender'
  fnr: string
  onChange(fnr: string): void
  opprinneligFnr: string
  opprinneligNavn?: Person['navn']
}

export function useJournalføringPart({
  part,
  fnr,
  onChange,
  opprinneligFnr,
  opprinneligNavn,
}: UseJournalføringPartOptions) {
  const [redigerer, setRedigerer] = useState(false)
  const [inputFnr, setInputFnr] = useState('')
  const [feil, setFeil] = useState<string | null>(null)
  const [laster, setLaster] = useState(false)
  const oppslagId = useRef(0)

  const { personInfo } = usePerson(fnr)

  useEffect(
    () => () => {
      oppslagId.current++
    },
    []
  )

  const navn = personInfo
    ? formaterNavn(personInfo.navn)
    : fnr === opprinneligFnr && opprinneligNavn
      ? formaterNavn(opprinneligNavn)
      : ''

  function startRedigering() {
    setRedigerer(true)
    setFeil(null)
    setInputFnr(fnr)
  }

  function avbrytRedigering() {
    oppslagId.current++
    setLaster(false)
    setRedigerer(false)
    setFeil(null)
    setInputFnr('')
  }

  async function velg() {
    const søktFnr = inputFnr.trim()
    setFeil(null)
    if (!søktFnr) {
      setFeil(`${part} ikke funnet i PDL`)
      setInputFnr('')
      return
    }

    const gjeldendeOppslag = ++oppslagId.current
    setLaster(true)
    try {
      const person = await http.post<{ fnr: string }, Person>('/api/person', { fnr: søktFnr })
      if (gjeldendeOppslag !== oppslagId.current) return
      if (!person?.fnr) {
        setFeil(`${part} ikke funnet i PDL`)
        setInputFnr('')
        return
      }

      onChange(person.fnr)
      setInputFnr('')
      setRedigerer(false)
    } catch {
      if (gjeldendeOppslag !== oppslagId.current) return
      setFeil(`${part} ikke funnet i PDL`)
      setInputFnr('')
    } finally {
      if (gjeldendeOppslag === oppslagId.current) setLaster(false)
    }
  }

  return {
    redigerer,
    inputFnr,
    feil,
    laster,
    navn,
    startRedigering,
    avbrytRedigering,
    velg,
    setInputFnr,
  }
}
