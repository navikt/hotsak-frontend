import React, { useContext, useState } from 'react'

import { Ressurs } from '../../types/types.internal'
import { byggTomRessurs } from './ressursFunksjoner'

type ValgtDokumentType = {
  journalpostID: string
  dokumentID: string
}

type DokumentContextType = {
  valgtDokument: ValgtDokumentType
  setValgtDokument: (valgtDokument: ValgtDokumentType) => void
  hentetDokument: Ressurs<string>
  settHentetDokument: (hentetDokument: Ressurs<string>) => void
}

const initialState = {
  valgtDokument: { journalpostID: '', dokumentID: '' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValgtDokument: () => {},
  hentetDokument: byggTomRessurs<string>(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  settHentetDokument: () => {},
}

const DokumentContext = React.createContext<DokumentContextType>(initialState)

const DokumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [valgtDokument, setValgtDokument] = useState(initialState.valgtDokument)
  const [hentetDokument, settHentetDokument] = React.useState<Ressurs<string>>(byggTomRessurs<string>())

  return (
    <DokumentContext.Provider value={{ valgtDokument, setValgtDokument, hentetDokument, settHentetDokument }}>
      {children}
    </DokumentContext.Provider>
  )
}

function useDokumentContext(): DokumentContextType {
  const context = useContext(DokumentContext)

  if (!context) {
    throw new Error('useDokumentContext must be used within a DokumentProvider')
  }

  return context
}

export { DokumentContext, DokumentProvider, useDokumentContext }
